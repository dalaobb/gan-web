'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Divider } from '@/components/ui/divider';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { authClient } from '@/lib/auth-client';

const FormSchema = z.object({
  email: z.email(),
});

export default function InputForm({
  callbackURL = '/',
}: {
  callbackURL?: string;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  });

  async function signInWithGoogle() {
    try {
      const { error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      });
      if (error) toast.error(error.message || 'Could not start Google sign-in');
    } catch {
      toast.error('Could not start Google sign-in');
    }
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const { error } = await authClient.signIn.magicLink({
        email: data.email,
        callbackURL,
      });
      if (error) {
        toast.error(error.message || 'Could not send the sign-in link');
        return;
      }
      toast.success('Check your email for a sign-in link');
    } catch {
      toast.error('Could not send the sign-in link');
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button className="h-10" type="button" onClick={signInWithGoogle}>
        Continue with Google
      </Button>
      <Divider className="my-2">Or</Divider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="block w-full h-10" type="submit">
            Continue with Email
          </Button>
        </form>
      </Form>
    </div>
  );
}
