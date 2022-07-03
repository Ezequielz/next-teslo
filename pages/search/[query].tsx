import type { NextPage, GetServerSideProps } from 'next'
import { Box, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
// import { initialData } from '../../database/products'
import { ProductList } from '../../components/products'
import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'

interface Props {
    products: IProduct[];
    foundProducts:boolean;
    query: string;
}


const SearchPage: NextPage<Props> = ({ products, foundProducts, query}) => {


//  const { products , isLoading } =  useProducts('/search/haha')

  return (
    <ShopLayout  title={'Teslo-Shop - Search'} pageDescription={'Encuentra los mejores productos de Teslo aquí'} >
      <Typography variant='h1' component='h1'>Buscar Productos</Typography>

      {
          foundProducts 
            ? <Typography variant='h2' sx={{ mb: 1 }} textTransform="capitalize">Término: { query }</Typography>
            :( 
              <Box display='flex'>
                <Typography variant='h2' sx={{ mb: 1 }}>No encontramos ningún producto</Typography>
                <Typography variant='h2' sx={{ ml: 1 }} color="secondary" textTransform="capitalize">{ query }</Typography>
              </Box>
            )
      }

      {/* {
        isLoading
        ? <FullScreenLoading />
        : <ProductList 
            // products={ initialData.products as any }
            products={ products }
          />
      } */}

            <ProductList products={ products } />

    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query = '' } = params as { query: string };
   
    if ( query.length === 0 ){
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    // y no hay prod
    let products = await dbProducts.getProductsByTerm( query );
    const foundProducts = products.length > 0;

    // TODO retornar otros prod
    if ( !foundProducts ) {
        // products = await dbProducts.getAllProducts()
         products = await dbProducts.getProductsByTerm( 'shirt' );

    }

    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage
