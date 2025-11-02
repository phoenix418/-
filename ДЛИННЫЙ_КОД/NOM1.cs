
// Простые классы-модели для демонстрации
public class Order
{
    public string Id { get; set; }
    public List<OrderItem> Items { get; set; } = new List<OrderItem>();
    public double TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public object Console { get; internal set; }

    public double CalculateTotalAmount()
    {
        return (double)Items.Sum(item => item.Product.Price * item.Quantity);
    }
}

public class OrderItem
{
    public Product Product { get; set; }
    public int Quantity { get; set; }
}

public class Product
{
    public string Name { get; set; }
    public decimal Price { get; set; }
    public bool IsInStock { get; set; }
}

public class Customer
{
    public string Name { get; set; }
    public string Email { get; set; }
}

public enum OrderStatus
{
    Created,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

public class OrderService
{
    public void ProcessOrder(Order order, Customer customer, bool isDiscountApplied)
    {
        Console.WriteLine($"Проверка наличия товара на складе для заказа: {order.Id}");
        foreach (var item in order.Items)
        {
            if (!item.Product.IsInStock)
            {
                throw new InvalidOperationException($"Товар {item.Product.Name} отсутствует на складе");
            }
        }
        Console.WriteLine("Все товары в наличии.");
        double totalAmount = order.CalculateTotalAmount();
        if (isDiscountApplied)
        {
            Console.WriteLine("Применение скидки 10%");
            totalAmount = totalAmount * 0.9;
            order.TotalAmount = totalAmount;
        }
        Console.WriteLine($"Итоговая сумма: {totalAmount}");
        Console.WriteLine("Сохранение заказа в базу данных...");
        order.Status = OrderStatus.Created;
        Console.WriteLine($"Заказ сохранен с ID: {order.Id}");
        Console.WriteLine($"Отправка email клиенту: {customer.Email}");
        string emailContent = $"Уважаемый {customer.Name}! " +
                             $"Ваш заказ #{order.Id} " +
                             $"на сумму {totalAmount} создан.";
        Console.WriteLine($"Email отправлен: {emailContent}");
    }
}