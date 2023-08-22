"use strict";
// Seeder for Prisma schema data
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Import PrismaClient
const { PrismaClient } = require('@prisma/client');
// Create an instance of PrismaClient
const prisma = new PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const patients = [
            {
                name: 'John Doe',
                asrama: 'A1',
                hospitalizations: {
                    create: {
                        complaint: 'Fever and cough',
                    },
                },
                checkUps: {
                    create: {
                        requirement: 'Regular checkup',
                        payment_source: 'Insurance',
                        payment_total: 150.0,
                        payment: 0.0,
                        status: 'Pending',
                    },
                },
                borrowMoneyInCash: {
                    create: {
                        payment: 50.0,
                        status: 'Pending',
                        payment_date_time: new Date(),
                        checkUp: { connect: { id: 1 } }
                    },
                },
                hostel: {
                    create: {
                        name: "takhosus"
                    }
                }
            },
            // Add more patient data here if needed
        ];
        for (const patient of patients) {
            yield prisma.patient.create({
                data: patient,
            });
        }
    });
}
main()
    .catch((e) => {
    throw e;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    // Close the PrismaClient connection
    yield prisma.$disconnect();
}));
