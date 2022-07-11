import { FC, useContext } from 'react'
import NextLink from 'next/link'

import { CartContext } from '../../context'

import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"
import { ItemCounter } from '../ui'
import { ICartProduct, IOrderItem } from '../../interfaces'





interface Props {
    editable?: boolean;
    products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable=false , products}) => {

    const { cart: productsInCart , updateCartQuantity, removeCartProduct} = useContext(CartContext);

    const onNewCartQuantityValue = ( product: ICartProduct , newQuantityValue: number ) => {
        product.quantity = newQuantityValue;
        updateCartQuantity( product )
    }

    const productsToShow = products ? products : productsInCart
   
  return (
    <>
        {
            productsToShow.map( product => ( 
                // <Typography key={ product.slug }>{ product.title }</Typography>
                <Grid container spacing={2} key={ product.slug + product.size } sx={{ mb:1 }}>
                    <Grid item xs={3}>
                        {/* Llevar a la pagina del producto */}
                        <NextLink href={`/product/${product.slug}`} passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia 
                                        image={ `/products/${ product.images }` }
                                        component='img'
                                        sx={{ borderRadius: '5px' }}
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Talla: <strong>{product.size}</strong> </Typography>

                            {/* condicional */}
                          {
                            editable
                            ?   (
                                <ItemCounter 
                                        currentValue={product.quantity} 
                                        maxValue={10} 
                                        updatedQuantity={( value )=>onNewCartQuantityValue( product as ICartProduct, value )}
                                />
                            )
                            :  ( 
                                <Typography variant="h4">{ product.quantity } { product.quantity > 1 ? 'productos' : 'producto' } </Typography>
                            )

                          }

                        </Box>
                    </Grid>
                    <Grid item xs={2} display='flex' flexDirection='column' alignItems='center'>
                        <Typography variant='subtitle1'> { `$${ product.price }` } </Typography>

                        {/* editable */}
                          {
                            editable && (
                                <Button 
                                    variant='text' 
                                    color="secondary"
                                    onClick={() => removeCartProduct( product as ICartProduct )}
                                >
                                    Remover
                                </Button>
                            )
                            
                          }

                    </Grid>



                </Grid>
            ))

        }
    
    </>
  )
}
