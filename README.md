# Latitude-and-Longitude-comparisons-using-Google-Maps
Users can compare what other big cities have the same longitude or latitude as them.


Demo: https://codepen.io/nasatex/full/RBXrYb/

I created a database here (https://github.com/nastex21/db_JSON_of_populous_cities) using data from http://www.demographia.com/db-worldua.pdf. The data is a list of metropolitan from around the world and I gathered the ones with more than one million inhabitants. 

After that, I created a JavaScript app that used the geocode-geonames wrapper (https://github.com/nastex21/grab_long_lat_cities) that went through the cities and got the coordinates of each metro area.

Using the gathered data from both projects, I created this website. A basic synopsis of it is that it compares your coordinates or the coordinates you entered with the latitude OR longitude values of the metro cities in the database when you click on the respective “Compare” button.

The “Adjuster” section takes the value you entered (or set) and by clicking on the plus/minus signs, you can add or subtract degrees to that value and then compare them to the database.

The values will be spat out in a table on the right side of the screen.
