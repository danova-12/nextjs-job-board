import Image from 'next/image'
import prisma from '@/lib/prisma'
import JobListItem from '@/components/JobListItem'
import JobFilterSidebar from '@/components/JobFilterSidebar'
import H1 from '@/components/ui/h1'
import { JobFilterValues } from '@/lib/validation'
import JobResults from "@/components/JobResult"
import { Metadata } from 'next'
interface PageProps{
  searchParams:{
    q?:string,
    type?:string,
    location?:string,
    remote?:string
  }
}
function getTitle({q,type,location,remote }:JobFilterValues){
  const titlePrefix = q
  ?`${q} jobs`
  :type
  ?`${type} developer jobs`
  :remote
  ?"Remote developer jobs"
  :"All developer jobs"
  const titleSuffix = location
  ?`in ${location}`:""
  return `${titlePrefix}${titleSuffix}`
}
//generate dynamic meta data 
export function generateMetadata({
  searchParams:{q,type,location,remote}}:PageProps):Metadata{
  return{
    title:`${getTitle({
      q,
      type,
      location,
      remote: remote === "true"
    }) }| Flow Jobs`
  }
  
}
export default async function Home({
  searchParams:{q,type,location,remote}
}:PageProps) {
   const filterValues: JobFilterValues ={
    q,
    type,
    location,
    remote:remote === "true"
   }
  return (
    <main className='max-w-5xl  space-y-10 px-3 my-10 m-auto'>
      <div className='space-y-10 text-center'>
        <H1>
           {getTitle(filterValues)}
        </H1>
        <p className='text-muted-foreground'>
          find your dream job
        </p>
      </div>
    <section className='flex flex-col md:flex-row gap-4'>
      <JobFilterSidebar defaultValues={filterValues}/>
     <JobResults filterValues={filterValues}/>
    </section>
    </main>
  )
}