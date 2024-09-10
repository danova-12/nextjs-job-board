"use client";
import H1 from "@/components/ui/h1";
import {Form, FormMessage, FormItem, FormLabel,FormControl, FormField} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import { createJobSchema, CreateJobValues } from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import { jobTypes } from "@/lib/job-types";
import Select from "@/components/ui/select";
import { locationTypes } from "@/lib/job-types";
import LocationInput from "@/components/LocationInput"
import {X} from "lucide-react"
import {Label} from "@/components/ui/label"
import RichTextEditor from "@/components/RichTextEditor";
import { draftToMarkdown } from "markdown-draft-js";
import LoadingButton from "@/components/LoadingButton";
import { createJobPosting } from "./actions";

export default function NewJobForm(){
    const form = useForm<CreateJobValues>({
        resolver:zodResolver(createJobSchema)    
    })
    const {
        handleSubmit,
        watch,
        trigger,
        control,
        setValue,
        setFocus,
        formState:{isSubmitting}

    } = form;

    async function onSubmit(values:CreateJobValues){
      const formData = new FormData();
      Object.entries(values).forEach(([key,value])=>{
          if(value){
             formData.append(key,value);
          }
      })
      try{
        await createJobPosting(formData);

      }catch(error){
       alert("something went wrong, please try again")
      }
    }
    return(
        <main className="max-w-3xl m-auto my-10 space-y-10">
           <div className="space-y-5 text-center">
             <H1>find your perfect developer</H1>
             <p className="text-muted-foreground ">
                get your job seen by thoushend of job seekers.
             </p>
           </div>
           <div className="space-y-6 border rounded-lg p-4">
               <div>
                 <h2 className="font-semibold">Job details</h2>
                 <p className="text-muted-foreground">
                    preview a job description and details
                 </p>
               </div>
               <Form {...form}>
                  <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}
                  >
                  <FormField 
                  control={control}
                  name="title"
                  render={({field})=>(
                    <FormItem>
                        <FormLabel>Job title </FormLabel> 
                        <FormControl>
                            <Input placeholder="frontend developer" {...field}/>

                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                  />
                  <FormField 
                  control={control}
                  name="type"
                  render= {({field})=>(
                    <FormItem>
                      <FormLabel>
                        Job type
                      </FormLabel>
                      <FormControl>
                      <Select {...field} defaultValue="">
                        <option value="" hidden>
                            Select an option
                        </option>
                        {jobTypes.map(jobType=>(
                            <option key={jobType} value={jobType} >
                                {jobType}
                            </option>
                        ))
                        }
                      </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                   

                  )}
                />
                <FormField 
                  control={control}
                  name="companyName"
                  render={({field})=>(
                    <FormItem>
                        <FormLabel>Company </FormLabel> 
                        <FormControl>
                            <Input  {...field}/>

                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                  />
                <FormField 
                  control={control}
                  name="companyLogo"
                  render={({field:{value,...fieldValues}})=>(
                    <FormItem>
                        <FormLabel>Companylogo</FormLabel> 
                        <FormControl>
                            <Input  {...fieldValues} 
                            type="file"
                            accept="image/*"
                            onChange={(e)=>{
                              const file = e.target.files?.[0]
                              fieldValues.onChange(file)

                            }}
                            />

                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                  />

                 <FormField 
                  control={control}
                  name="locationType"
                  render= {({field})=>(
                    <FormItem>
                      <FormLabel>
                      location
                      </FormLabel>
                      <FormControl>
                      <Select {...field} defaultValue="" 
                      onChange={e=>{
                        field.onChange(e)
                        if (e.currentTarget.value === "Remote"){
                          trigger("location")
                        }
                      }}
                      >
                        <option value="" hidden>
                            Select an option
                        </option>
                        {locationTypes.map(locationType=>(
                            <option key={locationType} value={locationType} >
                                {locationType}
                            </option>
                        ))
                        }
                      </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                   

                  )}
                />
                <FormField 
                  control={control}
                  name="location"
                  render={({field})=>(
                    <FormItem>
                        <FormLabel>office location </FormLabel> 
                        <FormControl>
                            <LocationInput onLocationSelected={field.onChange} 
                            ref={field.ref}
                            />

                        </FormControl>
                          {watch("location") && (
                            <div className="flex items-center gap-1"> 
                               <button 
                               type="button"
                               onClick={()=>{
                                setValue("location", "",{shouldValidate:true})
                               }}
                               >
                                <X size={20} />
                             
                               </button>
                               <span className="text-sm ">
                                   {watch("location")}
                                </span>

                            </div>
                          )}
                        <FormMessage />
                    </FormItem>
                  )}
                  />
                  <div className="space-y-2">
                    <Label htmlFor="applicationEmail">
                        How to apply
                    </Label>
                    <div className="flex justify-between">
                      <FormField 
                      control={control}
                      name="applicationEmail"
                      render={({field})=>(
                        <FormItem className="grow">
                          <FormControl>
                          <div className="flex items-center">
                            <Input 
                            id="applicationEmail"
                            placeholder="email"
                            type="email"
                            {...field}
                            />
                             <span className="mx-2">or</span>
                             </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}

                       />
                        <FormField 
                      control={control}
                      name="applicationUrl"
                      render={({field})=>(
                        <FormItem className="grow">
                          <FormControl>
                            
                            <Input 
                            id="applicationEmail"
                            placeholder="url"
                            type="website"
                            {...field}
                            />
                           
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}

                       />
                    </div>
                    <FormField
                    control={control}
                    name="description"
                    render={({field})=>(
                      <FormItem>

                         <Label onClick={()=>setFocus("description")}>
                           description
                         </Label>
                         <FormControl>
                          <RichTextEditor 
                           onChange={draft=>field.onChange(draftToMarkdown(draft))}
                           ref={field.ref}
                           />
                         </FormControl>
                        
                         <FormMessage />
                      </FormItem>
                    )}
                    
                     />
                      <FormField 
                  control={control}
                  name="salary"
                  render={({field})=>(
                    <FormItem>
                        <FormLabel>salary</FormLabel> 
                        <FormControl>
                            <Input  {...field} type="number"/>

                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )}
                  />
                  <LoadingButton type="submit" loading={isSubmitting} >
                         Submit
                  </LoadingButton>
                  </div>
                  </form>


                </Form>
           </div> 

       </main>
    )
}