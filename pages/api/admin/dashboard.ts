import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = 
|{
    numberOfOrders           : number;
    paidOrders               : number; // isPaid true
    notPaidOrders            : number; 
    numberOfClients          : number; // role: client
    numberOfProducts         : number;
    productsWhithNoInventory : number; // 0 products
    lowInventory             : number; // productos con 10 o menos en stock
}
|{ message: string}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return dashboardData( req, res );
        default:
            return res.status(400).json({ message: 'Bad request' })
        }
}

const dashboardData = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    // EJEMPLO 2

    // const numberOfOrders = await Order.count();
    // const paidOrders = await Order.find({ isPaid: true }).count();
    // const numberOfClients = await User.find({ role: 'client' }).count();
    // const numberOfProducts = await Product.count();
    // const productsWhithNoInventory = await Product.find({ inStock: 0 }).count();
    // const lowInventory = await Product.find({ inStock: { $lte: 10 } }).count();

    // EJEMPLO 3, MAS EFICIENTE
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWhithNoInventory,
        lowInventory,

    ] = await Promise.all([
         Order.count(),
         Order.find({ isPaid: true }).count(),
         User.find({ role: 'client' }).count(),
         Product.count(),
         Product.find({ inStock: 0 }).count(),
         Product.find({ inStock: { $lte: 10 } }).count(),
    ])

    // EJEMPLO 1
    // const orders = await Order.find()
    //                                 .select('isPaid')
    //                                 .lean();
    // const numberOfOrders = orders.length
    // const paidOrders = orders.filter( order => order.isPaid ).length
    // const notPaidOrders = numberOfOrders - paidOrders

    // const users = await User.find()
    //                                 .select('')
    //                                 .lean();
    // const numberOfClients = users.filter( user => user.role === 'client' ).length

    // const products = await Product.find()
    //                                 .select('inStock')
    //                                 .lean();

    // const numberOfProducts = products.length
    // const productsWhithNoInventory = products.filter( product => product.inStock === 0).length
    // const lowInventory = products.filter( product => product.inStock >= 0 && product.inStock <=10 ).length

    await db.disconnect();


    return res.status(200).json({ 
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWhithNoInventory,
        lowInventory,
        notPaidOrders: numberOfOrders - paidOrders,
     })

}



