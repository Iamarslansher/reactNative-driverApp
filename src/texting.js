import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Modal } from "react-native";
import {
  query,
  collection,
  onSnapshot,
  db,
  orderBy,
  doc,
  updateDoc,
} from "../config/fireBase";

function Driver() {
  const [currentRide, setCurrentRide] = useState();
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [isRequestRejected, setIsRequestRejected] = useState(false);

  useEffect(() => {
    listenToRides();
  }, []);

  const listenToRides = () => {
    const q = query(collection(db, "Rides"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const rides = [];
      querySnapshot.forEach((doc) => {
        rides.push({ id: doc.id, data: doc.data() });
        // rides.push({ id: doc.id, ...doc.data() });
      });
      console.log("current rides", rides);
      if (rides.length > 0) {
        setCurrentRide(rides[rides.length - 1]);
      }
    });
    return unsubscribe;
  };

  if (!currentRide) {
    return <Text>no request yet..</Text>;
  }

  const acceptRequest = async () => {
    try {
      const rideRef = doc(db, "Rides", currentRide.id);
      await updateDoc(rideRef, {
        status: "accepted",
      });
      setIsRequestAccepted(true);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const rejectRequest = async () => {
    try {
      const rideRef = doc(db, "Rides", currentRide.id);
      await updateDoc(rideRef, {
        status: "rejected",
      });
      setIsRequestAccepted(false);
      setIsRequestRejected(true);
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Driver</Text>
      {currentRide && (
        <View style={styles.rides}>
          {/* Render ride details if currentRide is available */}
          <Text>Pickup: {currentRide[0].pickup.name}</Text>
          <Text>Destination: {currentRide[0].destination.name}</Text>
          <Text>Car Type: {currentRide[0].carType}</Text>
          <Text>Fare: {currentRide[0].fare}</Text>
          <Button title="Accept" onPress={acceptRequest} />
          <Button title="Reject" onPress={rejectRequest} />
        </View>
      )}
      {/* Popup to inform the user that their request has been accepted */}
      <Modal
        visible={isRequestAccepted}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsRequestAccepted(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Request Accepted!</Text>
          <Button title="Close" onPress={() => setIsRequestAccepted(false)} />
        </View>
      </Modal>
      <Modal
        visible={isRequestRejected}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsRequestRejected(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Request Rejected!</Text>
          <Button title="Close" onPress={() => setIsRequestRejected(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rides: {
    backgroundColor: "#fff",
    color: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
});

export default Driver;
