import Appointment from "../models/Appointment";
import AppointmentRepository from "../repositories/AppointmentsRepository";
import { startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";

interface Request {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({ date, provider_id }: Request): Promise<Appointment> {
        const Repository = getCustomRepository(AppointmentRepository);

        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await Repository.findByDate(
            appointmentDate
        );
        if (findAppointmentInSameDate) {
            throw Error("This appointment is already marked");
        }

        const appointment = Repository.create({
            provider_id,
            date: appointmentDate,
        });

        await Repository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
