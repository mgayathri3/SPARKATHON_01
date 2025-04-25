# Hydrobuddy  Reminder App

This is a Flask-based web application that helps users stay hydrated by sending periodic SMS reminders to drink water. The app uses the Twilio API to send SMS and integrates weather data to adjust the reminder based on the temperature in the user's city.

## Features

- *User Registration and Login*: Users can register and log in with their credentials.
- *Hydration Tracking*: Users can track their daily water intake and set a goal based on their weight.
- *SMS Reminders*: The app sends periodic SMS reminders to drink water.
- *Weather Integration*: Weather data is used to adjust the reminder based on the temperature of the user's city.

## Technologies Used

- *Flask*: Web framework used for building the application.
- *Twilio API*: For sending SMS reminders.
- *OpenWeatherMap API*: For fetching weather data based on the user's city.
- *APScheduler*: For scheduling periodic SMS reminders.
- *React*: For frontend UI.

## Setup Instructions

### Prerequisites

Before you begin, ensure that you have the following installed on your system:

- Python 3.x
- pip (Python package installer)
- A Twilio account (for SMS)
- An OpenWeatherMap API key
