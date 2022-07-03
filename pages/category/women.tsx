import type { NextPage } from 'next'
import { Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
// import { initialData } from '../database/products'
import { ProductList } from '../../components/products'
import { useProducts } from '../../hooks'
import { FullScreenLoading } from '../../components/ui'




const WomenPage: NextPage = () => {

 
 const { products , isLoading } =  useProducts('/products?gender=women')

  return (
    <ShopLayout  title={'Teslo-Shop - Women'} pageDescription={'Encuentra los mejores productos de Teslo para mujer'} >
      <Typography variant='h1' component='h1'>Mujer</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Productos para Mujer</Typography>

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

export default WomenPage
