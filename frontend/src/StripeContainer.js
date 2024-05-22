import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import React from "react";

const PUBLIC_KEY =
  "pk_test_51PGoqWRtMDqGkl0esjlkVSXu0SbtiImKeQY4Vqi4CeI4x16SwITYc00uOHvhETlgWbFc4tQZqI8YRSN1F9gXfke900iQOZ3Fqe";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

export default function StripeContainer() {
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm />
    </Elements>
  );
}

// test
