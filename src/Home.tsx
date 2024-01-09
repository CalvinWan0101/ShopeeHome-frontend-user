import React, { useEffect, useState } from 'react'
import ProductPreview from './ProductPage/ProductPreview'
import {DefultProduct} from './img_src.json'
import Pimg from './assets/testProductImg.jpg'
import {Link} from 'react-router-dom'
import axios from 'axios'
import { baseURL } from './APIconfig'
import { error } from 'console'
//test
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
//test
function Home() {
    //test
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/PersionalInformation_confirm');
    };
    //test

    const [productList , setProductList] = useState<ProductInList[]>([])

    useEffect(() => {
        axios
        .get<ProductInList[]>(baseURL + 'product/name/all')
        .then((response) => {
            setProductList(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    } , [])

    return (
        
        <div className=' flex flex-wrap justify-evenly'>
            {productList.map((item) => (
                <div key={item.id} className=' mx-1.5 my-3 '>
                    <Link to={`/Product/${item.id}`}>
                        <ProductPreview id={item.id}/>
                    </Link>
                </div>
            ))}
            {/* //test */}
            <Button variant="contained" color="primary" onClick={handleLoginRedirect}>
            修改
            </Button>
            {/* //test */}
        </div>
    )
}

export default Home