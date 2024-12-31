'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { useToast } from "../hooks/use-toast"

const ApplicationForm = () => {
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { toast } = useToast()
    const form = useForm({
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        position: '',
      },
    })

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
          const response = await fetch('http://localhost:3000/submit-application', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            throw new Error('Server responded with an error');
          }

          const result = await response.json();

          // Simulate a 2-second loading delay
          await new Promise((resolve) => setTimeout(resolve, 2000));

          toast({
            title: "Application Submitted",
            description: result.message,
          });

          form.reset();
          setStep(1);
        } catch (error) {
          console.error('Error submitting application:', error);

          // Simulate a 2-second loading delay
          await new Promise((resolve) => setTimeout(resolve, 2000));

          toast({
            title: "Submission Error",
            description: "An error occurred while submitting your application. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      };

    const nextStep = () => {
      form.trigger(['name', 'email', 'phone']).then((isValid) => {
        if (isValid) setStep(step + 1)
      })
    }

    const prevStep = () => setStep(step - 1)

    return (
      <>
        <div className='flex justify-center items-center min-h-screen bg-[#8e8eff]'>
        <Card className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-black">Application Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} className="border border-gray-300 rounded-md p-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} className="border border-gray-300 rounded-md p-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter your phone number" {...field} className="border border-gray-300 rounded-md p-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="dob"
                    rules={{ required: "Date of Birth is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="border border-gray-300 rounded-md p-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    rules={{ required: "Address is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your address" {...field} className="border border-gray-300 rounded-md p-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="position"
                    rules={{ required: "Position is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position Applied for</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the position you are applying for" {...field} className="border border-gray-300 rounded-md p-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Review Your Information</h3>
                  {Object.entries(form.getValues()).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting} className="bg-E6E6FA text-black border border-gray-300 hover:bg-gray-200">
              Previous
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={nextStep} disabled={isSubmitting} className="bg-black text-white hover:bg-gray-800">
              Next
            </Button>
          ) : (
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-black text-white hover:bg-gray-800">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          )}
        </CardFooter>
      </Card>
        </div>
      </>
    )
  }

  export default ApplicationForm
