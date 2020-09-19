import { InfringementTypeSchema } from './infringement-type.schema';
export class InfringementSchema {
  constructor(
    public plateNumber: string,
    public infringementType: InfringementTypeSchema,
    public infringementNotes: string,
    public driverSelects: string,
    public trafficAdminSelects: string,
    public driverNotes: string,
    public adminNotes: string,
    public image1: string
  ) {}
}
