"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppUser } from "@/lib/types";
import { supabase } from "@/lib/supabase"; // Import Supabase client

const formSchema = z.object({
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  postCode: z.string().min(5, "Post code must be at least 5 characters"),
  creditCard: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  name: z.string().optional(),
});


export default function ProfilePage() {
  const { toast } = useToast();
  const { session } = useAuth();
  const router = useRouter();
 
  
 const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    phoneNumber: (session?.user as AppUser)?.phoneNumber || "",
    postCode: (session?.user as AppUser)?.postCode || "",
    creditCard: (session?.user as AppUser)?.creditCard || "",
    city: (session?.user as AppUser)?.city || "",
    address: (session?.user as AppUser)?.address || "",
  },
});

useEffect(() => {
  const fetchUserData = async () => {
    if (session?.user?.id) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return;
      }

      if (data) {
        form.reset({
          phoneNumber: data.phone_number || "",
          postCode: data.post_code || "",
          creditCard: data.credit_card || "",
          city: data.city || "",
          address: data.address || "",
        });
      }
    }
  };

  fetchUserData();
}, [session, form]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          phone_number: values.phoneNumber,
          post_code: values.postCode,
          credit_card: values.creditCard,
          city: values.city,
          address: values.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session?.user?.id);
      if (error) {
        throw error;
      }
  
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Something went wrong while updating your profile",
        variant: "destructive",
      });
    }
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

        <div className="mb-8 p-4 bg-muted rounded-lg">
          <p className="font-medium">{(session.user as AppUser).name}</p>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Code</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creditCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Card</FormLabel>
                  <FormControl>
                    <Input placeholder="**** **** **** ****" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="New York" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}