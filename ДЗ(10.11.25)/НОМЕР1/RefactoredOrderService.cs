public class RefactoredOrderService
{
    
    public void ProcessOrder(Order order, Customer customer, bool isDiscountApplied)
    {
        Stock(order);
        Discount(order, isDiscountApplied);
        SaveOrderToDatabase(order);
        SendConfirmationEmail(customer, order);
    }


    private void Stock(Order order)
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

    }


    private void Discount(Order order, bool isDiscountApplied)
    {
        double totalAmount = order.CalculateTotalAmount();
        if (isDiscountApplied)
        {
            Console.WriteLine("Применение скидки 10%");
            totalAmount = totalAmount * 0.9;
            order.TotalAmount = totalAmount;
        }
    }
    private void SaveOrderToDatabase(Order order)
    {
        Console.WriteLine($"Итоговая сумма: {order.TotalAmount}");
        Console.WriteLine("Сохранение заказа в базу данных...");
        order.Status = OrderStatus.Created;
    }

    private void SendConfirmationEmail(Customer customer, Order order)
    {
        Console.WriteLine($"Заказ сохранен с ID: {order.Id}");
        Console.WriteLine($"Отправка email клиенту: {customer.Email}");
        string emailContent = $"Уважаемый {customer.Name}! " +
                             $"Ваш заказ #{order.Id} " +
                             $"на сумму {order.TotalAmount} создан.";
        Console.WriteLine($"Email отправлен: {emailContent}");
    }

}