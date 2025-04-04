import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import RNPickerSelect from 'react-native-picker-select';
import { usePlayerDataFetch } from '../hooks/useHome';
import { fetchMobile } from '../hooks/useWallet';
import HeaderThree from '../components/HeaderThree';


// Helper function to generate years dynamically
const generateYears = (): { label: string; value: string }[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => ({
    label: `${currentYear - i}`,
    value: `${currentYear - i}`,
  }));
};

// Helper function to generate months dynamically based on selected year
const generateMonths = (year: string): { label: string; value: string }[] => {
  return Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0'); // Ensures format: 01, 02, ..., 12
    return {
      label: new Date(parseInt(year), i).toLocaleString('default', { month: 'long' }), // Full month name
      value: `${year}-${month}`,
    };
  });
};

const DatewisePlayHistory: React.FC = () => {
  const navigation = useNavigation();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<string>(currentDate.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`
  );
  const [selectedDate, setSelectedDate] = useState<string>(currentDate.toISOString().slice(0, 10));

  
  const onDateChange = (day: DateData) => {
    setSelectedDate(day.dateString);
    navigation.navigate('PlayHistoryScreen' as never, { date: day.dateString } as never);
  };

  const onYearChange = (year: string) => {
    setSelectedYear(year);
    setSelectedMonth(`${year}-01`); // Reset to January when year changes
  };

  const onMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <View style={styles.container}>
      <HeaderThree title={'Datewise Play History'} />
      <View style={styles.containerwrapper}>
      <Text style={styles.title}>Datewise Play History</Text>

      {/* Year Picker */}
      {/* <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Year:</Text>
        <RNPickerSelect
          onValueChange={onYearChange}
          value={selectedYear}
          items={generateYears()}
          style={pickerSelectStyles}
        />
      </View> */}

      {/* Month Picker */}
      {/* <View style={styles.pickerContainer}>
        <Text style={styles.label}>Select Month:</Text>
        <RNPickerSelect
          onValueChange={onMonthChange}
          value={selectedMonth}
          items={generateMonths(selectedYear)}
          style={pickerSelectStyles}
        />
      </View> */}

      {/* Calendar */}
      <Calendar
        current={selectedDate}
        onDayPress={onDateChange}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: 'green' } }}
        theme={{
          selectedDayBackgroundColor: 'green',
          todayTextColor: 'red',
          arrowColor: 'green',
        }}
      />

      {/* Navigation Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
  },
  containerwrapper:{
    padding:20
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

// Picker styles
const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
  },
  inputAndroid: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    color: 'black',
  },
};

export default DatewisePlayHistory;
