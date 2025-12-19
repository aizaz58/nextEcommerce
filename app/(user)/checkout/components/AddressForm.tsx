"use client";

import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .regex(/^[A-Za-z\s]+$/, "Use letters and spaces only"),
  mobile: z.string().min(1, "Mobile number is required"),
  email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Enter a valid email"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  pincode: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  orderNote: z.string().optional(),
});

export type Address = z.infer<typeof addressSchema>;

type AddressFormProps = {
  form: UseFormReturn<Address>;
};

export default function AddressForm({ form }: AddressFormProps) {
  const {
    register,
    formState: { errors, touchedFields, isSubmitted },
  } = form;

  const fieldClass = (field: keyof Address) => {
    const hasError = !!errors[field];
    const isTouched = !!touchedFields[field];
    const showValidationState = isSubmitted || isTouched;

    if (!showValidationState) {
      // Neutral before first submit and before user interacts
      return "border px-4 py-2 rounded-lg w-full focus:outline-none border-gray-300";
    }

    if (hasError) {
      // Red whenever there is an error (after submit or after touch)
      return "border px-4 py-2 rounded-lg w-full focus:outline-none border-red-500 focus-visible:ring-red-500";
    }

    // Green when there is no error and field has been validated (submitted or touched)
    return "border px-4 py-2 rounded-lg w-full focus:outline-none border-green-500 focus-visible:ring-green-500";
  };

  return (
    <section className="flex-1 flex flex-col gap-4 border rounded-xl p-4">
      <h1 className="text-xl">Shipping Address</h1>
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          id="full-name"
          placeholder="Full Name"
          {...register("fullName")}
          className={fieldClass("fullName")}
        />
        {errors.fullName && (
          <p className="text-xs text-red-500">{errors.fullName.message}</p>
        )}

        <Input
          type="tel"
          id="mobile"
          placeholder="Mobile Number"
          {...register("mobile")}
          className={fieldClass("mobile")}
        />
        {errors.mobile && (
          <p className="text-xs text-red-500">{errors.mobile.message}</p>
        )}

        <Input
          type="email"
          id="email"
          placeholder="Email"
          {...register("email")}
          className={fieldClass("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}

        <Input
          type="text"
          id="address-line-1"
          placeholder="Enter Address Line 1"
          {...register("addressLine1")}
          className={fieldClass("addressLine1")}
        />
        {errors.addressLine1 && (
          <p className="text-xs text-red-500">{errors.addressLine1.message}</p>
        )}

        <Input
          type="text"
          id="address-line-2"
          placeholder="Enter Address Line 2"
          {...register("addressLine2")}
          className={fieldClass("addressLine2")}
        />

        <Input
          type="text"
          id="pincode"
          placeholder="Enter Pincode"
          {...register("pincode")}
          className={fieldClass("pincode")}
        />

        <Input
          type="text"
          id="city"
          placeholder="Enter City"
          {...register("city")}
          className={fieldClass("city")}
        />
        {errors.city && (
          <p className="text-xs text-red-500">{errors.city.message}</p>
        )}

        <Input
          type="text"
          id="state"
          placeholder="Enter State"
          {...register("state")}
          className={fieldClass("state")}
        />

        <textarea
          id="delivery-notes"
          placeholder="Notes about you order, e.g special notes for delivery"
          {...register("orderNote")}
          className={fieldClass("orderNote")}
        />
      </div>
    </section>
  );
}


