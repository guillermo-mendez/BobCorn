import * as React from "react";
import {Button} from "@/components/ui/button";
import Title from "@/components/Title.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useToast} from "@/hooks/use-toast"; // Importa tu hook personalizado
import { Loader2 } from "lucide-react"
import {buyCorn} from "@/api/apiService.ts";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useState} from "react";

const CornPurchase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast()

  const FormSchema = z.object({
    clientCode: z.string().min(4, {
      message: "El código de cliente debe tener al menos 4 caracteres.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      clientCode: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    try {
      const result = await buyCorn(data.clientCode);
        toast({
        title: "¡Éxito!",
        description: `${result.message} 🌽`,
      })
      setIsLoading(false);

    } catch (error: any) {
      if(error.status === 429) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response?.data?.message || "Error al comprar maíz"
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Error al comprar maíz"
        })
      }

    }
  }


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Title text="Venta de Maíz Bob 🌽" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-md space-y-6 bg-white p-8 rounded-md shadow-md">
          <FormField
            control={form.control}
            name="clientCode"
            render={({field}) => (
              <FormItem>
                <FormLabel>Código del usuario</FormLabel>
                <FormControl>
                  <Input placeholder="Código Cliente" {...field} />
                </FormControl>
                <FormDescription>Introduzca el código de cliente.</FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <span className="flex items-center justify-center">
              <Loader2 className="animate-spin h-5 w-5 mr-2 text-white" />
              Procesando...
            </span>
            ) : (
              "Comprar maíz"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );

};

export default CornPurchase;
