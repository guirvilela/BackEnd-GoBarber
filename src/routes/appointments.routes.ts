import { Router } from "express";
import { parseISO } from "date-fns";
import { getCustomRepository } from "typeorm";
import AppointmentRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";
import ensureAuthenticate from "../middlewares/ensureAuthenticated";

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticate);

appointmentsRouter.get("/", async (request, response) => {
    const Repository = getCustomRepository(AppointmentRepository);
    const appointments = await Repository.find();

    return response.json(appointments);
});

appointmentsRouter.post("/", async (request, response) => {
    try {
        const { provider_id, date } = request.body;

        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({
            provider_id,
            date: parsedDate,
        });
        return response.json(appointment);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter;
