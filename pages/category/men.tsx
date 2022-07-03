import type { NextPage } from 'next'
import { Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
// import { initialData } from '../database/products'
import { ProductList } from '../../components/products'
import { useProducts } from '../../hooks'
import { FullScreenLoading } from '../../components/ui'




const MenPage: NextPage = () => {

 
 const { products , isLoading } =  useProducts('/products?gender=men')

  return (
    <ShopLayout  title={'Teslo-Shop - Men'} pageDescription={'Encuentra los mejores productos de Teslo para Hombre'} >
      <Typography variant='h1' component='h1'>Hombre</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Productos para Hombre</Typography>

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

export default MenPage
