-- Seed data for luxury car rental fleet (MVP showcase)
-- Run after schema.sql. Safe to re-run: wipes vehicles + vehicle_images first.

delete from vehicle_images;
delete from vehicles;

with inserted as (
  insert into vehicles (
    brand, model, year, category, daily_price_ils, status,
    description_he, engine_size, horsepower, zero_to_hundred, top_speed,
    transmission, seats, fuel_type, cover_image_url
  ) values
    (
      'Ferrari', '488 GTB', 2022, 'sport', 3500, 'available',
      'אייקון איטלקי עם V8 טורבו כפול. ביצועים מרהיבים לצד עיצוב חד ואלגנטי.',
      '3.9L V8 Twin-Turbo', 661, 3.0, 330,
      'אוטומט 7 הילוכים דו-מצמדי', 2, 'בנזין',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1600&q=80'
    ),
    (
      'Lamborghini', 'Huracán EVO', 2023, 'sport', 4200, 'available',
      'שור זועם מסנט''אגטה. מנוע V10 אטמוספרי, אחיזה מושלמת והאצות מסחררות.',
      '5.2L V10', 631, 2.9, 325,
      'אוטומט 7 הילוכים דו-מצמדי', 2, 'בנזין',
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1600&q=80'
    ),
    (
      'Porsche', '911 Carrera S', 2024, 'sport', 2800, 'rented',
      'סמל הספורט של פורשה. איזון מושלם בין ביצועים לשימוש יומיומי.',
      '3.0L Flat-6 Twin-Turbo', 443, 3.5, 308,
      'PDK אוטומט 8 הילוכים', 4, 'בנזין',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80'
    ),
    (
      'Mercedes-Benz', 'S-Class S580', 2023, 'sedan', 1500, 'available',
      'שיא היוקרה הגרמנית. תא נוסעים שקט וטכנולוגיה מתקדמת בכל פרט.',
      '4.0L V8 Biturbo + EQ Boost', 496, 4.4, 250,
      'אוטומט 9G-TRONIC', 5, 'בנזין היברידי',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1600&q=80'
    ),
    (
      'BMW', 'X7 M60i', 2024, 'suv', 1800, 'available',
      'SUV פלאגשיפ של BMW. שבעה מושבים, נוכחות עוצמתית ונוחות ללא פשרות.',
      '4.4L V8 Twin-Turbo', 523, 4.5, 250,
      'אוטומט 8 הילוכים', 7, 'בנזין',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=80'
    ),
    (
      'BMW', 'M4 Competition Convertible', 2023, 'convertible', 2200, 'maintenance',
      'קבריולט ספורטיבי עם גג בד. הנאת נהיגה פתוחה עם הביצועים של M4.',
      '3.0L I6 Twin-Turbo', 503, 3.7, 280,
      'אוטומט 8 הילוכים', 4, 'בנזין',
      'https://images.unsplash.com/photo-1555626906-fcf10d6851b4?w=1600&q=80'
    )
  returning id, brand, model, category
)
insert into vehicle_images (vehicle_id, url, alt_he, sort_order)
select i.id, img.url, img.alt_he, img.sort_order
from inserted i
cross join lateral (
  values
    (
      case i.brand || ' ' || i.model
        when 'Ferrari 488 GTB' then 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=1600&q=80'
        when 'Lamborghini Huracán EVO' then 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1600&q=80'
        when 'Porsche 911 Carrera S' then 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80'
        when 'Mercedes-Benz S-Class S580' then 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1600&q=80'
        when 'BMW X7 M60i' then 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600&q=80'
        when 'BMW M4 Competition Convertible' then 'https://images.unsplash.com/photo-1555626906-fcf10d6851b4?w=1600&q=80'
      end,
      i.brand || ' ' || i.model || ' — מבט חזיתי',
      0
    ),
    (
      case i.brand
        when 'Ferrari' then 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=80'
        when 'Lamborghini' then 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80'
        when 'Porsche' then 'https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=1600&q=80'
        when 'Mercedes-Benz' then 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1600&q=80'
        else 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1600&q=80'
      end,
      i.brand || ' ' || i.model || ' — מבט צד',
      1
    ),
    (
      case i.category
        when 'sport' then 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1600&q=80'
        when 'sedan' then 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1600&q=80'
        when 'suv' then 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1600&q=80'
        else 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80'
      end,
      i.brand || ' ' || i.model || ' — פנים הרכב',
      2
    ),
    (
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1600&q=80',
      i.brand || ' ' || i.model || ' — פרטים',
      3
    )
) as img(url, alt_he, sort_order);
