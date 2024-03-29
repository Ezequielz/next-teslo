// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { Order, Product, User } from '../../models'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if ( process.env.NODE_ENV === 'production' ) {
        return res.status(401).json({ message: 'No tiene acceso a este servicio' })
    }

    await db.connect();

        // Borra usuarios
        await User.deleteMany()
        //inserta users semilla
        await User.insertMany(seedDatabase.initialData.users)

        
        //borrar productos
        await Product.deleteMany()
        // inserta productos semilla
        await Product.insertMany( seedDatabase.initialData.products )

        // Borrar orders
        await Order.deleteMany()
        
    await db.disconnect();


    res.status(200).json({ message: 'Proceso realizado correctamente' })
}