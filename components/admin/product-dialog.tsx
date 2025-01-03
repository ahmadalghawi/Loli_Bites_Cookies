{/* Previous imports remain the same */}

export function ProductDialog({
  product,
  open,
  onOpenChange,
  onSubmit,
}: ProductDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      stockLevel: 0,
      status: "active" as const,
      imageUrl: "",
      isOnSale: false,
      discountPercentage: 0,
    }
  });

  // Reset form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stockLevel: product.stockLevel,
        status: product.status,
        imageUrl: product.imageUrl,
        isOnSale: product.isOnSale,
        discountPercentage: product.discountPercentage || 0,
      });
    }
  }, [product, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...values,
        id: product?.id // Include the ID for updates
      });
      
      toast({
        title: "Success",
        description: `Product ${product ? "updated" : "created"} successfully`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: `Failed to ${product ? "update" : "create"} product`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Form fields remain the same */}
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (product ? "Update Product" : "Add Product")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}