import * as React from "react";
// import {useState} from "react";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {buyCorn} from "@/api/apiService.ts";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useState} from "react";

const CornPurchase: React.FC = () => {
   const [message, setMessage] = useState<string>('');

  const FormSchema = z.object({
    clientCode: z.string().min(4, {
      message: "El código de usuario debe tener al menos 4 caracteres.",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientCode: '12345',
    },
  })

  async function onSubmit (data: z.infer<typeof FormSchema>) {
    try {
      console.log(data)
      const response = await buyCorn(data.clientCode); // ID de cliente codificado de forma fija, por ejemplo
      setMessage(response.message);
    } catch (error: any) {
       setMessage(error.response?.data?.message || 'Error al comprar maíz');
    }
  }


  // const handlePurchase = async () => {
  //   try {
  //     const response = await buyCorn('12345'); // ID de cliente codificado de forma fija, por ejemplo
  //     setMessage(response.message);
  //   } catch (error: any) {
  //     setMessage(error.response?.data?.message || 'Error al comprar maíz');
  //   }
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="clientCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código del usuario</FormLabel>
              <FormControl>
                <Input placeholder="Código Usuario" {...field} />
              </FormControl>
              <FormDescription>
                Introduzca el código de cliente..
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )

  //
  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gray-100">
  //     <div className="p-8 bg-white rounded shadow-md text-center">
  //       <h1 className="text-2xl font-bold mb-4">Buy Corn 🌽</h1>
  //       <Input placeholder="shadcn"  />
  //       <Button
  //         onClick={handlePurchase}
  //       >
  //         Buy Corn
  //       </Button>
  //       {message && <p className="mt-4 text-gray-700">{message}</p>}
  //     </div>
  //   </div>
  // );
};

export default CornPurchase;
