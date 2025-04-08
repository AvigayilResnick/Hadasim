import pandas as pd

#1)
# 1. Load the Excel file
# df = pd.read_excel('time_series.xlsx')-זה מלפני השינוי של 4. בנוסף לזה כל המקומות שכתוב בהם mean_value לפני השינוי כלומר כשה לא היה מירוקרק היה כתוב שם רק Value כמו שנמצא בExcel
df = pd.read_parquet('time_series.parquet')

# 2. Try converting the 'timestamp' column to datetime format
try:
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    print(" 'timestamp' column successfully converted to datetime.")
except Exception as e:
    print(" Error in 'timestamp' column:", e)

# 3. Check if 'value' column exists and is numeric
if 'mean_value' in df.columns:
    if pd.api.types.is_numeric_dtype(df['mean_value']):
        print("'mean_value' column is numeric.")
    else:
        print(" 'mean_value' column is not numeric.")
else:
    print(" 'mean_value' column is missing.")

# 4. Check for missing values in each column
missing = df.isna().sum()
print("\n Missing values per column:")
print(missing)

if missing.any():
    print("Warning: Missing values detected!")

#2)
df['mean_value'] = pd.to_numeric(df['mean_value'], errors='coerce')

# Make sure the timestamp column is the index
df = df.set_index('timestamp')

# Resample the data hourly and calculate the mean of 'value'
hourly_avg = df['mean_value'].resample('h').mean().reset_index()

# Rename columns for clarity
hourly_avg.columns = ['start_time', 'average_value']

# Display the result
print("\n Hourly Averages:")
print(hourly_avg.head(24))

#3) Process in time-based chunks (e.g., per day), compute hourly averages for each

print("\n Processing data in daily chunks...")

# Group by day (based on the index which is already timestamp)
daily_chunks = [group for _, group in df.groupby(df.index.date)]

# List to hold hourly averages for each day
hourly_averages_list = []

for chunk in daily_chunks:
    # Make sure index is datetime (might already be, but just to be safe)
    chunk.index = pd.to_datetime(chunk.index)

    # Resample hourly and compute mean
    hourly_avg = chunk['mean_value'].resample('h').mean().reset_index()

    # Rename columns for consistency
    hourly_avg.columns = ['start_time', 'average_value']

    # Add to list
    hourly_averages_list.append(hourly_avg)

# Concatenate all daily results
final_result = pd.concat(hourly_averages_list, ignore_index=True)

# Save to CSV/Excel
final_result.to_csv('hourly_averages_by_chunk.csv', index=False)
final_result.to_excel('hourly_averages_by_chunk.xlsx', index=False)

print("Finished processing in chunks. Results saved to 'hourly_averages_by_chunk.csv'.")
print(final_result.head())

#4)
# כאשר הנתונים מגיעים בזרימה (stream),
# כלומר כל פעם מתקבלת רשומה חדשה אחת ולא כל הקובץ יחד, אי אפשר לעבד את הכל מראש.
# לכן, צריך לבנות פתרון שיאפשר לחשב את הממוצעים השעתיים תוך כדי הגעת הנתונים – בזמן אמת.
# הדרך שאני הייתי בוחרת היא לשמור לכל שעה את הסכום של כל הערכים שהתקבלו עד עכשיו, ואת מספר הערכים שהתקבלו באותה שעה. 
# ברגע שמגיעה רשומה חדשה עם timestamp ו-value, אני מחשבת לאיזו שעה היא שייכת (למשל עי עיגול השעה כלפי מטה), ומעדכנת את הסכום והכמות של אותה שעה.
# ככה אני יכולה תמיד לחשב את הממוצע השעתי על בסיס הסכום חלקי הכמות, בלי לשמור את כל הנתונים עצמם – רק מידע מצטבר.

#5)
# יתרונות של פורמט Parquet:
# זה פורמט עמודי ודחוס ששומר מקום על הדיסק, טוען הרבה יותר מהר, אפשר לשלוף רק עמודות מסוימות בלי לקרוא את כל הקובץ,
# והוא גם נתמך טוב בכלים מודרניים כמו Pandas, Spark וכו'.
