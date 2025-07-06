import React from 'react'
import HomeSection from '../../components/HomeSection/HomeSection'
import HeroSection from '../../components/HeroSection/HeroSection'
import { useStore } from '../../context/StoreContext';
import Store from '../../components/Store/Store';




const HomePage = () => {

  const {products} = useStore();


  return (
    <div className=''>
        <HeroSection/>

{/* <Store product={products}/> */}
      <HomeSection title1="Men's" title2="Wear" Category='men'/>
      <HomeSection title1="Women's" title2="Wear" Category='women'/>
      <HomeSection title1="Kids'" title2="Wear" Category='kids'/>
    </div>
  )
}

export default HomePage