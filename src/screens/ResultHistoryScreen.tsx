import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
import {Text} from 'react-native-paper';
import {format} from 'date-fns';
import HeaderThree from '../components/HeaderThree';
import NavFooter from '../components/NavFooter';
import appStyles from '../styles/appStyles';
import useDecemberMonthResult from '../hooks/useDecemberMonthResult';
import useMarkets from '../hooks/useMarkets';
import {useNavigation} from '@react-navigation/native';

const ResultHistoryScreen = () => {
  const [selectedMonthValue, setSelectedMonthValue] = useState('');
  const [selectedMonthDates, setSelectedMonthDates] = useState<any>([]);

  // Fetch results based on selected date or fetch all if no date is selected
  const {
    result = [],
    isLoading,
    error,
  } = useDecemberMonthResult({date: selectedMonthValue});
  const {markets = []} = useMarkets();

  const navigation = useNavigation();

  // Utility functions for date manipulation
  function getMonthYear() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // Adding 1 because getMonth() is zero-based
    const currentYear = now.getFullYear();

    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;

    // Adjust for January (0)
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear -= 1;
    }

    return {
      currentMonthYear: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`,
      previousMonthYear: `${prevYear}-${prevMonth.toString().padStart(2, '0')}`,
    };
  }

  function extractMonthYear(dateString:any) {
    const parts = dateString.split('-');
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[0], 10);
    return {month, year};
  }

  function getDatesOfMonth(year:any, month:any) {
    const dates = [];
    const date = new Date(year, month - 1, 1); // Subtract 1 to make the month zero-based

    while (date.getMonth() === month - 1) {
      dates.push(new Date(date)); // Push a copy of the date into the array
      date.setDate(date.getDate() + 1); // Increment the day
    }

    return dates;
  }

  // Update selected month dates whenever the month changes
  useEffect(() => {
    if (selectedMonthValue) {
      const {month, year} = extractMonthYear(selectedMonthValue);
      const dates = getDatesOfMonth(year, parseInt(month, 10));
      setSelectedMonthDates(dates);
    } else {
      setSelectedMonthDates([]); // Reset dates if no month is selected
    }
  }, [selectedMonthValue]);
  console.log('this is result data or error', result, error);
  if (isLoading) {
    return <Text>Loading...</Text>; // Show loading indicator while fetching data
  }

  if (!result || result.length === 0) {
    return <Text>No results found</Text>; // Display message when no results are found
  }

  const groupedResults = result?.reduce((acc:any, res:any) => {
    const date = format(new Date(res.created_at), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = {};
    }
    acc[date][res.market_name] = res.bet_key;
    return acc;
  }, {});

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <HeaderThree title="Result History" />
      <ScrollView>
        <View style={{padding: 20}}>
          <View style={{marginBottom: 20}}>
            <View
              style={{borderRadius: 5, borderWidth: 1, borderColor: '#cccccc'}}>
              <Picker
                selectedValue={selectedMonthValue}
                onValueChange={month => setSelectedMonthValue(month)}
                style={{color: '#000000'}}>
                <Picker.Item label="Select a month" value="" />
                <Picker.Item
                  label={getMonthYear().currentMonthYear}
                  value={getMonthYear().currentMonthYear}
                />
                <Picker.Item
                  label={getMonthYear().previousMonthYear}
                  value={getMonthYear().previousMonthYear}
                />
              </Picker>
            </View>
          </View>
        </View>
        <ScrollView horizontal>
          <View>
            <View style={{backgroundColor: '#E1EFE6', flexDirection: 'row'}}>
              <Text style={styles.headerCell}>Date</Text>
              {markets?.map((market:any, index:number) => (
                <Text key={index} style={styles.headerCell}>
                  {market.market}
                </Text>
              ))}
            </View>
            {selectedMonthDates.length > 0
              ? selectedMonthDates.map((date:any) => (
                  <View key={date.toString()} style={styles.resultRow}>
                    <Text style={styles.dateCell}>
                      {format(date, 'yyyy-MM-dd')}
                    </Text>
                    {markets?.map((market:any) => {
                      const marketResult = result?.find(
                        (res:any) =>
                          res.market_name === market.market &&
                          format(new Date(res.created_at), 'yyyy-MM-dd') ===
                            format(date, 'yyyy-MM-dd'),
                      );
                      return (
                        <Text key={market.id} style={styles.resultCell}>
                          {marketResult?.bet_key || '-'}
                        </Text>
                      );
                    })}
                  </View>
                ))
              : Object.entries(groupedResults).map((date:any, marketResults:any) => (
                  <View key={date} style={styles.resultRow}>
                    <Text style={styles.dateCell}>{date}</Text>
                    {markets?.map((market:any) => (
                      <Text key={market.id} style={styles.resultCell}>
                        {marketResults[market.market] || '-'}
                      </Text>
                    ))}
                  </View>
                ))}
                {/* Object.entries(groupedResults).map(([date, marketResults]) => (
                  <View key={date} style={styles.resultRow}>
                    <Text style={styles.dateCell}>{date}</Text>
                    {markets?.map(market => (
                      <Text key={market.id} style={styles.resultCell}>
                        {marketResults[market.market] || '-'}
                      </Text>
                    ))}
                  </View>
                ))} */}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={{...styles.Btn, marginVertical: 20, marginHorizontal: 10}}
          onPress={() =>
            Linking.openURL('https://bgmgame.in/').catch(err =>
              console.error("Couldn't load page", err),
            )
          }>
          <Text style={styles.primaryBtn}>More Results {'>>'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <NavFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  ...appStyles,
  headerCell: {
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
    padding: 15,
    minWidth: 145,
    borderLeftWidth: 1,
    borderLeftColor: '#E1EFE6',
  },
  resultRow: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
  },
  dateCell: {
    color: '#ffffff',
    textAlign: 'left',
    fontWeight: '500',
    padding: 15,
    minWidth: 145,
    borderLeftWidth: 1,
    borderLeftColor: '#ffffff',
  },
  resultCell: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
    padding: 15,
    minWidth: 145,
    borderLeftWidth: 1,
    borderLeftColor: '#ffffff',
  },
});

export default ResultHistoryScreen;
