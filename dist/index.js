"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-nocheck
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const { PrismaClient } = require('@prisma/client');
// Create an instance of PrismaClient
const prisma = new PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.get('/api/hostels', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield prisma.hostel.findMany();
    res.json({ data });
}));
app.post("/api/hostels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        yield prisma.hostel.create({
            data: data
        });
        res.json({ status: "oke" });
    }
    catch (e) {
        res.status(500).json({ errors: e.message });
    }
}));
app.post("/api/checkups", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield prisma.checkUp.create({
            data: {
                patient: {
                    create: {
                        name: data.name,
                        address: data.address,
                        hostel: {
                            connect: {
                                id: parseInt(data.hostelId)
                            }
                        }
                    }
                },
                requirement: data.requirement,
                payment_source: data.paymentSource,
                payment_total: data.paymentTotal,
                payment: data.payment,
                status: data.paymentTotal ? "- " + data.paymentTotal : ""
            }
        });
        console.log(result);
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ errors: e.message });
    }
}));
app.get("/api/checkups", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.checkUp.findMany({
            include: {
                patient: {
                    include: {
                        hostel: true
                    }
                },
                borrowMoneyInCash: true
            }
        });
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ errors: e.message });
    }
}));
// update checkUp
app.patch("/api/checkups", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let data = {};
        const checkup = yield prisma.checkUp.findMany({
            where: {
                id: body.id
            }
        });
        console.log(body);
        if (checkup.length === 0) {
            res.status(501).json({ message: "data not found" });
        }
        if (body.payment_total) {
            data.payment_total = body.payment_total;
        }
        else if (body.payment) {
            data.payment = body.payment;
            data.payment_at = new Date().toISOString();
            let status = checkup[0].payment_total - body.payment;
            console.log(status);
            if (status === 0) {
                data.status = "lunas";
            }
            else if (status > 0) {
                data.status = "kurang -" + status.toString();
            }
            else if (status < 0) {
                data.status = "lebih " + status.toString();
            }
            console.log(data);
        }
        const result = yield prisma.checkUp.update({
            where: {
                id: body.id
            },
            data: data
        });
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ errors: e.message });
    }
}));
app.post("/api/hospitalizations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield prisma.hospitalization.create({
            data: {
                patient: {
                    create: {
                        name: data.name,
                        address: data.address,
                        hostel: {
                            connect: {
                                id: parseInt(data.hostelId)
                            },
                        }
                    }
                },
                status: "inap",
                complaint: data.complaint
            }
        });
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ errors: e.message });
    }
}));
app.get("/api/hospitalizations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma.hospitalization.findMany({
            include: {
                patient: {
                    include: {
                        hostel: true
                    }
                }
            }
        });
        res.json({ data });
    }
    catch (e) {
        res.status(500).json({ errora: e.message });
    }
}));
app.patch("/api/hospitalizations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        let data = {};
        const exist = yield prisma.hospitalization.findMany({
            where: {
                id: body.id
            }
        });
        if (exist === 0) {
            res.status(501).json({ errors: "data not found" });
        }
        if (body.status) {
            data.status = body.status;
        }
        if (body.return_at) {
            data.return_at = body.return_at;
        }
        if (body.selisih) {
            data.selisih = body.selisih;
        }
        console.log(data);
        const result = yield prisma.hospitalization.update({
            where: {
                id: body.id
            },
            data: data
        });
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ errors: e.message });
    }
}));
app.get("/api/borrow-in-cash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma.borrowMoneyInCash.findMany({
            include: {
                patient: true,
                checkUp: true
            }
        });
        res.json({ data: result });
    }
    catch (e) {
        res.status(500).json({ errors: e.message });
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
