import { Inject, Injectable, forwardRef } from '@nestjs/common';
import mongoose from 'mongoose';
import { TicketRepo as TicketRepo } from './ticket.repo';
import { NotFoundError } from '../../errors/not-found-error';
import { BadRequestError } from '../../errors/bad-request-error';
import { DuplicateError } from '../../errors/duplicate-error';
import { InGetPaginatedTickets } from './dtos/in-get-paginated-tickets.dto';
import { OutGetPaginatedTicketsDto } from './dtos/out-get-paginated-tickets.dto';
import { TypeTicketDto } from './dtos/type-ticket.dto';
import { InCreateTicket as InCreateTicket } from './dtos/in-create-ticket.dto';
import { TicketDao } from './daos/course.dao';
import { BaseError } from '../../errors/base-error';
import { OutGetTicketDto } from './dtos/out-get-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepo: TicketRepo) {}

  async createTicket(
    ticketInfo: InCreateTicket,
  ): Promise<TypeTicketDto | DuplicateError> {
    const ticketModel = await this.ticketRepo.create(ticketInfo);
    const ticket = TicketDao.convertOne(ticketModel);

    return ticket;
  }

  async deleteTicketById(
    ticketId: string,
  ): Promise<OutGetTicketDto | NotFoundError | BadRequestError> {
    const isIdValid = mongoose.Types.ObjectId.isValid(ticketId);
    if (!isIdValid) return new BadRequestError('InvalidInputId');
    const ticketModel = await this.ticketRepo.deleteById(
      new mongoose.Types.ObjectId(ticketId),
    );
    if (!ticketModel) return new NotFoundError('Ticket');
    const ticket = TicketDao.convertOne(ticketModel);
    return { ticket };
  }

  async getPaginatedTickets(
    input: InGetPaginatedTickets,
  ): Promise<OutGetPaginatedTicketsDto | BadRequestError> {
    const tickets = await this.ticketRepo.getPaginatedTicket(
      input.num,
      (input.page - 1) * input.num,
      input.type,
    );
    if (tickets instanceof BadRequestError) return tickets.throw();
    const res: OutGetPaginatedTicketsDto = {
      count: tickets.count ?? 0,
      values: tickets.values.map(TicketDao.convertOne),
    };

    return res;
  }
}
