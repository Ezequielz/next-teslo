import type { NextPage } from 'next'
import { Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
// import { initialData } from '../database/products'
import { ProductList } from '../../components/products'
import { useProducts } from '../../hooks'
import { FullScreenLoading } from '../../components/ui'




const KidPage: NextPage = () => {

 
 const { products , isLoading } =  useProducts('/products?gender=kid')

  return (
    <ShopLayout  title={'Teslo-Shop - Kids'} pageDescription={'Encuentra los mejores productos de Teslo para niños'} >
      <Typography variant='h1' component='h1'>Niños</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Productos para Niños</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList 
            // products={ initialData.products as any }
            products={ products }
          />
      }


    </ShopLayout>
  )
}

export default KidPage
