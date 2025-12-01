/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import type { IProduct } from "../interfaces";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/products/recommendations')
        setRecommendations(response.data)
      } catch (error:any) {
        toast.error(error?.message||"Failed to load recommendations");
      } finally { 
        setIsLoading(false);
      }
    }
    fetchRecommendations();
  }, [])
  if (isLoading) { 
    return <LoadingSpinner />
  }
  return (
  <div className='mt-8'>
			<h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3'>
				{recommendations.map((product:IProduct) => (
					<ProductCard key={product._id} product={product} />
				))}
			</div>
    </div>
  )
};
export default PeopleAlsoBought