import {z} from 'zod';
import { jobTypes, locationTypes } from './job-types';
import { validateHeaderValue } from 'http';
const requiredString = z.string().min(1,"Required");
const companyLogoSchema = z.custom<File|undefined>()
.refine(file=>!file || (file instanceof File && file.type.startsWith("image/")),
"Must be an Image file")
.refine(file=>{
    return !file || file.size < 1024 * 1024*2
},"File must be less thamn 2mb");

const applicationSchema = z.object({
    applicationEmail:z.string().max(100).email().optional().or(z.literal('')),
    applicationUrl:z.string().max(100).url().optional().or(z.literal('')),
})
.refine(data=>data.applicationEmail || data.applicationUrl,{
message:"Email or url is required",
path:["applicationemail"]
})
const numericRequiredString = requiredString.regex(/^\d+$/,"must be a number")

const locationSchema = z.object({
  locationType:requiredString.refine(
    value => locationTypes.includes(value), 
    "Invalid Location type"
   ),
   location:z.string().max(100).optional()
})
.refine(
    data=>!data.locationType || data.locationType === "Remote" ||data.location,
    {
        message:"location is required for on-site jobs",
          path:["location"]  
        
    }
)

export const createJobSchema =z.object({
    title:requiredString.max(100),
    type:requiredString.refine(value=>jobTypes.includes(value),
    "Invalid job type"
),
companyName:requiredString.max(100),
companyLogo: companyLogoSchema,
description:z.string().max(500).optional(),
salary:numericRequiredString.max(9,"Number cant be longer than nine digit"),


}

)
.and(applicationSchema)
.and(locationSchema);

export type CreateJobValues = z.infer<typeof createJobSchema>;

export const jobFilterSchema = z.object({
    q:z.string().optional(),
    type:z.string().optional(),
    location:z.string().optional(),
    remote:z.coerce.boolean().optional(), 

})

export type JobFilterValues = z.infer<typeof jobFilterSchema>