import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 mt-10">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Have a question or need assistance? Fill out the form below and we&apos;ll get back to you as soon as possible.
      </p>

      <div className="max-w-lg mx-auto bg-card p-8 rounded-lg shadow-lg">
        <form action="mailto:your-email@example.com" method="post" encType="text/plain" className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" type="text" placeholder="Your Name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="your@example.com" />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" type="text" placeholder="Subject of your inquiry" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" placeholder="Your message..." rows={5} />
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
