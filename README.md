به نام خدا

نحوه استفاده از NumberMask در جاوااسکریپت:
ابتدا فایل numberMask.js را به روش ذیل در Head داخل کنید:
<html>

        <head>

                <title>

                        Test

                </title>

                <script src="numberMask.js">

                </script>

        </head>

        <body dir="rtl">

                <input onkeypress="tmp_val = this.value;"  onkeyup="return validateInputKeyPress(event);" title="###.##" value="0.0" />

        </body>

</html>

سپس به موارد ذیل درمورد Input مورد نظر توجه کنید
۱- در onkeypress بنویسید :
tmp_val = this.value;
۲- در onkeyup بنویسید:
return validateInputKeyPress(event);
۳- در title فرمت مورد نظر را بنویسید که در آن # به معنی یک رقم و @ به معنی هر چند رقم است.
####/##/##
۴- دقت نمایید که مقدار اولیه مطابق با فرمت داده شود.
