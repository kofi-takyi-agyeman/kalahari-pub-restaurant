import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { WhyChooseKalahari } from "@/components/home/WhyChooseKalahari";
import { OrderingCTA } from "@/components/home/OrderingCTA";
import { LocationContact } from "@/components/home/LocationContact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedDishes />
      <WhyChooseKalahari />
      <OrderingCTA />
      <LocationContact />
    </>
  );
}
