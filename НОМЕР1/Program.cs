namespace ДЗ_10._11._25_.НОМЕР1
{
    internal class Program
    {
        internal static int Main()
        {
            var orderService = new RefactoredOrderService();

            var customer = new Customer { Name = "Иван Иванов", Email = "ivan@example.com" };

            var order = new Order
            {
                Id = "ORD-001",
                Items = new List<OrderItem>
            {
                new OrderItem
                {
                    Product = new Product { Name = "Ноутбук", Price = 50000, IsInStock = true },
                    Quantity = 1
                },
                new OrderItem
                {
                    Product = new Product { Name = "Мышь", Price = 1500, IsInStock = true },
                    Quantity = 1
                }
            }
            };

            try
            {
                orderService.ProcessOrder(order, customer, isDiscountApplied: true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка при обработке заказа: {ex.Message}");
            }
            return 0;
        }
    }
}
