import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Product , Order } from '../../../models';


type Data = 
| { message: string }
| IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'POST':
            return createOrder( req, res );
        default:
            return res.status(400).json({ message: 'Bad request' })
        }


    }

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { orderItems, total } = req.body as IOrder;

    // verificar que tengamos un usuario
    const session : any = await getSession({ req });

    if ( !session ) {
        return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' })
    }

    // crear un arreglo con los productos que la persona quiere

    const productsIds = orderItems.map( product => product._id );

    await db.connect()
                        //  buscar todos los productos cuyo id existan en productsIds                   
    const dbProducts = await Product.find({ _id: { $in: productsIds} });
    // console.log({dbProducts})

    try {

        const subTotal = orderItems.reduce( (prev,current) => {
            const currentPrice = dbProducts.find( prod => prod.id === current._id )?.price;
            if ( !currentPrice ) {
                throw new Error('Verifique el carrito de nuevo, producto no existe')
            }

           return (currentPrice * current.quantity) + prev 
        }, 0 );

        const taxRate = Number( process.env.NEXT_PUBLIC_TAX_RATE || 0 );
        const backendTotal = subTotal * ( taxRate + 1 );

        if ( total !== backendTotal ) {
            throw new Error('El total no cuadra con el monto')
        }

        // Todo bien si llego a este punto

        const userId = session.user._id;
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId  })
        
                     // quito todos los decimales,  y al dividir entre 100 devuelve siempre 2 decimales.
        newOrder.total = Math.round( newOrder.total * 100 ) / 100;


        await newOrder.save();
        await db.disconnect();
        return res.status(201).json( newOrder );
        
    } catch (error:any) {
        await db.disconnect();
        console.log(error);
        res.status(400).json({
            message: error.message || 'Revise logs del servidor'
        })
        
    }

    // return res.status(201).json(req.body)
}
