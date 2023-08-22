//@ts-nocheck
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from "cors"
const { PrismaClient } = require('@prisma/client');

// Create an instance of PrismaClient
const prisma = new PrismaClient();

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;


app.use(cors())
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.get('/api/hostels', async (req: Request, res:Response)=>{
  const data = await prisma.hostel.findMany()
  res.json({data})
})

app.post("/api/hostels", async (req:Request, res:Response)=>{
  const data = req.body
  try {
    await prisma.hostel.create({
      data: data
    })
    res.json({status:"oke"})
  } catch (e:any) {
    res.status(500).json({errors: e.message})
  }
})

app.post("/api/checkups", async(req:Request, res:Response)=>{
  try {
    const data = req.body
    
    const result = await prisma.checkUp.create({
      data:{
        patient:{
          create:{
            name: data.name,
            address: data.address,
            hostel:{
              connect:{
                id: parseInt(data.hostelId)
              }
            }
          }
        },
        requirement: data.requirement,
        payment_source: data.paymentSource,
        payment_total: data.paymentTotal,
        payment: data.payment,
        status: data.paymentTotal ? "- "+data.paymentTotal:"" 
      }
    })
    console.log(result)
    res.json({data:result})
  } catch (e:any) {
    res.status(500).json({errors:e.message})
    
  }
})
app.get("/api/checkups", async (req:Request, res:Response)=>{
  try {
  const data = await prisma.checkUp.findMany({
      include:{
        patient:{
          include:{
            hostel:true
          }
        },
        borrowMoneyInCash:true
      }
    })
    res.json({data})
  } catch(e:any){
    res.status(500).json({errors:e.message})
  }
})

// update checkUp

app.patch("/api/checkups", async (req:Request, res:Response)=>{
  try {
    const body = req.body
    let data:any = {}
    const checkup = await prisma.checkUp.findMany({
      where: {
        id: body.id
      }
    })

    console.log(body)

    if (checkup.length === 0) {
      res.status(501).json({message:"data not found"})
    }

    if (body.payment_total) {
      data.payment_total = body.payment_total
    } else if (body.payment) {
      data.payment = body.payment
      data.payment_at = new Date().toISOString()
      let status = checkup[0].payment_total - body.payment
      console.log(status)
      if (status === 0) {
        data.status = "lunas"
      } else if(status > 0) {
        data.status = "kurang -" + status.toString()
      } else if (status <0) {
        data.status = "lebih " + status.toString()
      }
      console.log(data)
      
    
    }
    const result = await prisma.checkUp.update({
      where:{
        id: body.id
      },
      data: data
    })
    res.json({data:result})
  } catch (e:any) {
    res.status(500).json({errors:e.message})
  }
})

app.post("/api/hospitalizations", async (req:Request, res:Response)=>{
  try {
    const data = req.body
    const result = await prisma.hospitalization.create({
      data: {
        patient:{
          create:{
            name: data.name,
            address: data.address,
            hostel:{
              connect:{
              id: parseInt(data.hostelId)
            },
            }
          }
        },
        status: "inap",
      complaint: data.complaint
      }
    })
    res.json({data:result})
  } catch (e:any) {
    res.status(500).json({errors:e.message})
  }
})

app.get("/api/hospitalizations", async (req:Request, res:Response)=>{
  try {
    const data = await prisma.hospitalization.findMany({
      include:{
        patient: {
          include: {
            hostel: true
          }
        }
      }
    })
    res.json({data})
  } catch (e:any) {
    res.status(500).json({errora:e.message})
  }
})

app.patch("/api/hospitalizations", async (req:Request, res:Response)=>{
  try {
    const body = req.body
    let data:any = {}

    const exist = await prisma.hospitalization.findMany({
      where:{
        id: body.id
      }
    })

    if (exist === 0) {
      res.status(501).json({errors:"data not found"})
    }
    if (body.status) {
      data.status = body.status
    } 
    if (body.return_at) {
    	data.return_at = body.return_at
    } 
    if (body.selisih) {
    	data.selisih = body.selisih
    }
    console.log(data)
    
    const result = await prisma.hospitalization.update({
      where:{
        id: body.id
      },
      data:data
    })
    
    res.json({data: result})
  } catch (e:any) {
    res.status(500).json({errors: e.message})
  }
})

app.get("/api/borrow-in-cash", async (req:Request, res:Response)=>{
  try {
    const result = await prisma.borrowMoneyInCash.findMany({
      include:{
        patient:true,
        checkUp:true
      }
    })
    res.json({data:result})
  } catch (e:any) {
    res.status(500).json({errors:e.message})
    
  }
})


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
