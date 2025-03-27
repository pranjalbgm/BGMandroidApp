import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface PaginationPageProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationPage: React.FC<PaginationPageProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
    console.log('come till here');
  };

  console.log('this is toatl page ', totalPages);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePrev}
        disabled={currentPage === 1}
        style={[styles.button, currentPage === 1 && styles.disabled]}>
        <Text
          style={[styles.buttonText, currentPage === 1 && styles.disabledText]}>
          Previous
        </Text>
      </TouchableOpacity>

      <Text style={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </Text>

      <TouchableOpacity
        onPress={handleNext}
        disabled={currentPage === totalPages}
        style={[styles.button, currentPage === totalPages && styles.disabled]}>
        <Text
          style={[
            styles.buttonText,
            currentPage === totalPages && styles.disabledText,
          ]}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  disabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledText: {
    color: '#666666',
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PaginationPage;
