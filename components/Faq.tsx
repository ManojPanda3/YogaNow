import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What makes your yoga mats high quality?",
    answer:
      "Our yoga mats are crafted from premium, eco-friendly materials that provide excellent grip, cushioning, and durability. They are designed to support your practice, whether you're a beginner or an experienced yogi.",
  },
  {
    question: "How do I clean my yoga mat?",
    answer:
      "We recommend wiping your mat with a damp cloth after each use. For a deeper clean, you can use a mixture of water and a few drops of mild soap. Avoid using harsh chemicals or putting your mat in the washing machine.",
  },
  // {
  //   question: "Do you offer international shipping?",
  //   answer:
  //     "Yes, we ship our products worldwide. Shipping costs and delivery times vary depending on the destination. You can find more information on our shipping information page.",
  // },
  {
    question: "What other yoga accessories do you sell?",
    answer:
      "Besides our high-quality yoga mats, currently we are only selling yoga cloths for male and femals",
  },
];

export function Faq() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8" id="faq">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Find answers to the most common questions about our products and
          services.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-lg font-medium">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-gray-700">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
