import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import HeaderThree from '../components/HeaderThree';
import Loader from '../components/Loader';
import {fetchMobile} from '../hooks/useWallet';
import {usePlayerData} from '../hooks/useHome';
import useReferedBonusList from '../hooks/useBonusReportList';

const BonusChildDetails: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [selectedChildMobile, setSelectedChildMobile] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);

  const playerData = usePlayerData();
  
  // Fetch bonus list with either only parent_mobile or both parent_mobile & child_mobile
  const {bonusOn, isLoading, error, refetch} = useReferedBonusList({
    parent_mobile: mobileNumber,
    user_mobile: selectedChildMobile,
  });

  // Fetch mobile number on mount
  useEffect(() => {
    fetchMobile(setMobileNumber);
  }, []);

  useEffect(() => {
    if (mobileNumber) {
      playerData.mutate({mobileNumber});
    }
  }, [mobileNumber]);

  // Handle clicking on "View" to fetch details with both parent & child mobile
  const handleViewDetails = (childMobile: string) => {
    setSelectedChildMobile(childMobile); // Update selected child mobile
    refetch(); // Refetch data with updated params
  };

  return (
    <TouchableWithoutFeedback>
      <ScrollView>
        <View style={styles.container}>
          <HeaderThree title={'Bonus Report'} />

          <View style={styles.contentContainer}>
            <ScrollView horizontal>
              <View>
                <View style={styles.headerRow}>
                  <Text style={styles.headerText}>S.No.</Text>
                  <Text style={styles.headerText}>Name</Text>
                  <Text style={styles.headerText}>Mobile</Text>
                  <Text style={styles.headerText}>Commission</Text>
                  <Text style={styles.headerText}>Referral Level</Text>
                  <Text style={styles.headerText}>Action</Text>
                </View>

                {Array.isArray(bonusOn) && bonusOn.length > 0 ? (
                  bonusOn.map((bonus: any, index: number) => (
                    <View key={index} style={styles.dataRow}>
                      <Text style={styles.dataText}>{index + 1}</Text>
                      <Text style={styles.dataText}>{bonus.name}</Text>
                      <Text style={styles.dataText}>{bonus.mobile}</Text>
                      <Text style={styles.dataText}>{bonus.commision_amount}</Text>
                      <Text style={styles.dataText}>{bonus.referral_level}</Text>
                      <TouchableOpacity onPress={() => handleViewDetails(bonus.mobile)}>
                        <Text style={styles.viewButton}>View</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : isLoading ? (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.dataText}>Loading...</Text>
                  </View>
                ) : (
                  <View style={styles.noDataContainer}>
                    <Text style={styles.dataText}>No Data Available.</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>

          <Loader visiblity={loader} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  headerRow: {
    backgroundColor: '#013220',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  headerText: {
    color: '#ffffff',
    fontWeight: '500',
    minWidth: 145,
  },
  dataRow: {
    backgroundColor: '#ECECEC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  dataText: {
    color: '#000000',
    fontWeight: '500',
    minWidth: 145,
  },
  viewButton: {
    color: 'white',
    backgroundColor:"green",
    borderRadius:10,
    padding:10,
  },
  noDataContainer: {
    backgroundColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
});

export default BonusChildDetails;
