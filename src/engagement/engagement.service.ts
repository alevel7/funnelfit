import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientRequestStatus } from 'src/common/enums/cfo-request.enum';
import { LoggedInUser } from 'src/common/interface/jwt.interface';
import { SendResponse } from 'src/common/utils/responseHandler';
import { CFOProfile } from 'src/entities/cfo-profile.entity';
import { CfoRequest } from 'src/entities/cfo-request.entity';
import { ClientRequest } from 'src/entities/client-request.entity';
import { SMEProfile } from 'src/entities/sme-profile.entity';
import { User } from 'src/entities/user.entity';
import { ProducerService } from 'src/messaging/queue/producer.service';
import { Repository } from 'typeorm';
import { CfoRequestDto, ClientRequestDto } from './dto/cfoRequest.dto';
import * as crypto from 'crypto';
import { engagementSimilarity, experienceSimilarity, serviceTypeSimilarity } from 'src/sme/helper/partial-match.config';

@Injectable()
export class EngagementService {
    constructor(
        @InjectRepository(SMEProfile)
        private readonly smeRepo: Repository<SMEProfile>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(CFOProfile)
        private readonly cfoRepo: Repository<CFOProfile>,
        @InjectRepository(ClientRequest)
        private readonly clientRequestRepo: Repository<ClientRequest>,

        @InjectRepository(CfoRequest)
        private readonly cfoRequestRepo: Repository<CfoRequest>,
        private readonly producerService: ProducerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }
    async getCFORequests(smeId: string, page = 1, limit = 10) {
        const smeProfile = await this.smeRepo.findOne({
            where: { user: { id: smeId } },
        });
        if (!smeProfile) {
            throw new NotFoundException('SME Profile not found');
        }

        const pageNumber = Math.max(1, page);
        const pageSize = Math.min(100, Math.max(1, limit));
        const skip = (pageNumber - 1) * pageSize;

        const [requests, total] = await this.cfoRequestRepo.findAndCount({
            where: { sme: { id: smeProfile.id } },
            order: { createdAt: 'DESC' },
            skip,
            take: pageSize,
        });

        const meta = {
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize) || 1,
        };

        return SendResponse.success(
            { data: requests, meta },
            'CFO requests retrieved successfully',
        );
    }

    async getCFORequestResult(requestId: string, page: number) {
        console.log(
            'Fetching CFO request result for requestId:',
            requestId,
            'page:',
            page,
        );
        // get request from cache using the requestid and allow returning result in pagination
        let requests =
            (await this.cacheManager.get<CFOProfile[]>(
                `cfo-requests-${requestId}`,
            )) ?? [];
        console.log('Cached CFOs for request:', requests.length);
        if (requests.length === 0) {
            return SendResponse.success(
                requests,
                'CFO requests retrieved successfully',
            );
        }
        // return cached requests in pagination, 3 records at time by page number
        const startIndex = (page - 1) * 3;
        const endIndex = startIndex + 3;
        requests = requests.slice(startIndex, endIndex);
        return SendResponse.success(
            requests,
            'CFO requests retrieved successfully',
        );
    }

    async getAllRequestSelectedCfo(requestId: string, sme: LoggedInUser) {
        // get all selected cfos for a request from the database
        const cfoRequest = await this.cfoRequestRepo.findOne({
            where: { id: requestId },
            relations: ['sme'],
        });
        if (!cfoRequest) {
            throw new NotFoundException('CFO Request not found');
        }
        const clientRequestRepo =
            this.cfoRequestRepo.manager.getRepository('ClientRequest');
        const selectedCfos = await clientRequestRepo.find({
            where: { request: { id: requestId } },
            relations: ['cfo', 'cfo.user'],
            order: { createdAt: 'DESC' },
        });
        return SendResponse.success(
            selectedCfos,
            'Selected CFOs retrieved successfully',
        );
    }

    async sendRequestToCfo(requestId: string, body: ClientRequestDto, user:LoggedInUser) {
        // get cached cfos for the request id
        const cachedCfos =
            (await this.cacheManager.get<CFOProfile[]>(
                `cfo-requests-${requestId}`,
            )) ?? [];
        const selectedCfo = cachedCfos.find((cfo) => cfo.id === body.cfoId);
        if (!selectedCfo) {
            throw new NotFoundException('CFO not found for the given request');
        }
        // create a client request record
        const cfoRequest = await this.cfoRequestRepo.findOne({
            where: { id: requestId },
            relations: ['sme'],
        });
        if (!cfoRequest) {
            throw new NotFoundException('CFO Request not found');
        }
        const clientRequestRepo =
            this.cfoRequestRepo.manager.getRepository('ClientRequest');
        // if a record with the specified cfo and request exist return it
        let clientRequest = await clientRequestRepo.findOne({
            where: {
                cfo: { id: selectedCfo.id },
                request: { id: cfoRequest.id },
            },
        });
        if (clientRequest) {
            return SendResponse.success(clientRequest, 'Request already sent to CFO');
        }
        // else create a new record
        clientRequest = clientRequestRepo.create({
            request: cfoRequest,
            cfo: selectedCfo,
            sme: cfoRequest.sme,
        });
        clientRequest = await clientRequestRepo.save(clientRequest);

        // send email to the selected cfo
        const email = selectedCfo.user.email;
        const sme = cfoRequest.sme;
        this.producerService
            .publishEmail({
                to: email,
                subject: `Funnelfit: Service Request from ${sme.companyinfo.companyName}`,
                body: `${sme.companyinfo.companyName} has requested your services as a CFO. Please log in to your account to review the request.`,
            })
            .then(() => {
                console.log(`sending email  to ${email}`);
            })
            .catch((err) => {
                console.error(`Error sending email to ${email}: ${err}`);
            });
        return SendResponse.success(
            clientRequest,
            'Request sent to CFO successfully',
        );
    }
    async requestCFO(
        data: CfoRequestDto,
        user: LoggedInUser,
        page = 1,
        limit = 3,
    ) {
        const offset = (page - 1) * limit;
        const cacheKey = this.getCacheKey(data);
        const cached = await this.cacheManager.get<any[]>(cacheKey);

        if (cached) {
            const start = (page - 1) * limit;
            const end = start + limit;
            return cached.slice(start, end);
        }

        const pageNumber = Math.max(1, page);
        const pageSize = Math.min(100, Math.max(1, Number(limit)));

        const smeProfile = await this.smeRepo.findOne({
            where: { user: { id: user.id } },
        });
        if (!smeProfile) {
            throw new NotFoundException('SME Profile not found');
        }

        let request = await this.cfoRequestRepo.create({
            ...data,
            sme: smeProfile,
        });
        request = await this.cfoRequestRepo.save(request);

        const qb = this.cfoRepo
            .createQueryBuilder('cfo')
            .leftJoinAndSelect('cfo.user', 'user')
            .where(
                `
            EXISTS (
                SELECT 1 FROM jsonb_array_elements(cfo."expertiseAreas") AS expertise
                WHERE expertise ->> 'code' = :financialChallenge
            )`,
                { financialChallenge: data.financialChallenge.code },
            )
            .andWhere('cfo.engagementLength = :engagementTime', {
                engagementTime: data.engagementLength,
            })
            .andWhere('cfo.preferredEngagementModel = :serviceType', {
                serviceType: data.serviceType,
            })
            .andWhere("cfo.companySize ::jsonb ->> 'code' = :cfoExperience", {
                cfoExperience: data.cfoExperience,
            });

        // const [cfos, total] = await qb.skip((pageNumber - 1) * pageSize).take(pageSize).getManyAndCount();
        const [cfos, total] = await qb.take(100).getManyAndCount();

        const meta = {
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
        };

        // Step 2: Compute match scores
        const scored = cfos.map((p) => ({
            ...p,
            match_score: this.computeMatchScore(p, data),
        }));

        // Step 3: Sort + paginate
        const sorted = scored
            .sort((a, b) => b.match_score - a.match_score)
            .slice(offset, offset + limit);
        await this.cacheManager.set(
            `cfo-requests-${request.id}`,
            sorted,
            60 * 60 * 24,
        ); // cache for 24 hours
        return SendResponse.success(
            { meta, request },
            'CFO request submitted successfully',
        );
    }



    async getEngagements(sme: LoggedInUser) {
        const smeProfile = await this.smeRepo.findOne({
            where: { user: { id: sme.id } },
        });
        if (!smeProfile) {
            throw new NotFoundException('SME Profile not found');
        }
        // fetch all client requests where the request.sme.id = smeProfile.id and isMeetingCompleted is true
        const clientRequestRepo =
            this.cfoRequestRepo.manager.getRepository('ClientRequest');
        const engagements = await clientRequestRepo.find({
            where: {
                request: { sme: { id: smeProfile.id } },
                isMeetingCompleted: true,
                status: ClientRequestStatus.ACCEPTED
            },
            relations: ['cfo', 'request'],
            order: { updatedAt: 'DESC' },
        });
        return SendResponse.success(
            engagements,
            'Engagements retrieved successfully',
        );
    }

    async getEngagementDetail(projectId: string, sme: LoggedInUser) {
        const smeProfile = await this.smeRepo.findOne({
            where: { user: { id: sme.id } },
        });
        if (!smeProfile) {
            throw new NotFoundException('SME Profile not found');
        }
        // fetch the client request by id where the request.sme.id = smeProfile.id and isMeetingCompleted is true
        const clientRequestRepo =
            this.cfoRequestRepo.manager.getRepository('ClientRequest');
        const engagement = await clientRequestRepo.findOne({
            where: {
                request: { id: projectId, sme: { id: smeProfile.id } },
                // isMeetingCompleted: true,
                status: ClientRequestStatus.ACCEPTED
            },
            relations: ['cfo'],
            select:{
                cfo:{
                    id:true,
                    firstName:true,
                    lastName:true,
                }
            }
        });
        if (!engagement) {
            throw new NotFoundException('Engagement not found');
        }
        return SendResponse.success(
            engagement,
            'Engagement detail retrieved successfully',
        );
    }

    private getCacheKey(dto: CfoRequestDto): string {
        const str = JSON.stringify(dto);
        const hash = crypto.createHash('sha256').update(str).digest('hex');
        return `search:${hash}`;
    }



    // Compute weighted score (same as before)
    private computeMatchScore(cfo: CFOProfile, dto: CfoRequestDto): number {
        const weights = {
            financialChallenge: 0.3,
            serviceType: 0.25,
            cfoExperience: 0.2,
            urgencyLevel: 0.15,
            engagementLength: 0.1,
        };

        let score = 0;

        // --- Financial Challenge ---
        if (
            cfo.expertiseAreas
                ?.map((p) => p.code)
                ?.includes(dto.financialChallenge.code)
        )
            score += 1 * weights.financialChallenge;

        // --- Service Type ---
        score +=
            this.partialMatchScore(
                [cfo.preferredEngagementModel],
                dto.serviceType,
                serviceTypeSimilarity,
            ) * weights.serviceType;

        // --- CFO Experience ---
        score +=
            this.partialMatchScore(
                cfo.companySize.code ? [cfo.companySize.code] : [],
                dto.cfoExperience,
                experienceSimilarity,
            ) * weights.cfoExperience;

        // --- Urgency Level ---
        // score += this.partialMatchScore(
        //     cfo.urgency_levels,
        //     dto.urgencyLevel,
        //     urgencySimilarity,
        // ) * weights.urgencyLevel;

        // --- Engagement Length ---
        score +=
            this.partialMatchScore(
                cfo.engagementLength ? [cfo.engagementLength] : [],
                dto.engagementLength,
                engagementSimilarity,
            ) * weights.engagementLength;

        return score; // 0 → 1
    }

    private partialMatchScore(
        professionalValues: string[],
        targetValue: string,
        similarityMap: Record<string, string[]>,
    ): number {
        if (!professionalValues) return 0;
        if (professionalValues.includes(targetValue)) return 1;
        if (similarityMap[targetValue]) {
            const similarValues = similarityMap[targetValue];
            if (professionalValues.some((v) => similarValues.includes(v))) return 0.7;
        }
        return 0;
    }

}
