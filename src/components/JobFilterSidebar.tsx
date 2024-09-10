
import prisma from "@/lib/prisma"
import {Input } from './ui/input'
import {Label} from './ui/label' 
import {Button} from './ui/button'
import Select from './ui/select';
import { jobTypes } from "@/lib/job-types";
import { jobFilterSchema, JobFilterValues } from "@/lib/validation";
import {redirect} from "next/navigation"
import FormSubmitButton from "./FormSubmitButton";
async function filterJobs(formData:FormData){
 "use server";
 //throw new Error("bazinga")
 //turns form values to js object
 const values = Object.fromEntries(formData.entries())
const {q,type,location,remote} = jobFilterSchema.parse(values);

//to create searchparams or query with form "?q=val&type=remote&location=ethiopia"
const searchParams = new URLSearchParams({
    ...(q &&{q:q.trim()}),
    ...(type &&{type}),
    ...(location && {location}),
    ...(remote && {remote:"true"})
});
 redirect(`/?${searchParams.toString()}`)

}

interface JobFilterSidebarprops{
    defaultValues:JobFilterValues
}
export default async function JobFilterSidebar({defaultValues}:JobFilterSidebarprops){
    const distinctLocations = (await prisma.job.findMany({
        where:{approved:true},
        select:{location:true},
        distinct:["location"]
    }).then(locations=>
         locations.map(({location})=>location).filter(Boolean),
    ))as string[]
    return <aside className="md:w-[240px] top-0 sticky h-fit bg-background border rounded-lg">
          <form action={filterJobs} key={JSON.stringify(defaultValues)}>
            <div className="space-y-4">
                <div className='flex flex-col gap-2'>
                <Label htmlFor='q'>Search</Label>
                <Input id='q' name="q" placeholder='title,company,etc'
                 defaultValue={defaultValues.q}
                />
                </div> 
                <div className="flex flex-col gap-2">
                   <Label htmlFor="type">
                      Type
                   </Label>
                   <Select id="type" name="type" defaultValue={defaultValues.type || ""}>
                         <option value="">All locations</option>
                         {
                          jobTypes.map((type)=>
                           <option key={type} value={type}>
                            {type}
                           </option>
                          )
                         }
                   </Select>
                </div>
                <div className='flex flex-col gap-2'>
                    <Label htmlFor='location'>location</Label>
                    <Select id="location" name="location" defaultValue={defaultValues.location || ""}>
                    <option value="">All locations </option >
                    {distinctLocations.map(location=>( 
                        <option key={location} value={location }>{location}</option>
                    )
                    )}
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    
                     <input
                     id="remote"
                     name="remote"
                    
                    type="checkbox" 
                    className="scale-125 accent-black"
                    defaultChecked={defaultValues.remote}
                     />
                     <Label htmlFor="remote">remote jobs</Label>
                </div>
                <FormSubmitButton className="w-full">
                    Filter jobs
                </FormSubmitButton>
            </div>
          </form>
    </aside>
}