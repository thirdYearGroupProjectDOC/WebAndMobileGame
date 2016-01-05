# WebAndMobileGame
Web and Mobile Game for kids: Labyrinth (TuringLab)

1.0 Install npm dependencies (requires Python v2.7.* and C/C++/C# compiler):
```
npm install -g node-gyp
npm install
```


1.5 Install mongoDB
```
https://docs.mongodb.org/manual/installation/
```


2. Compile javascripts and run mongoDB (This app requires mongoDB to be installed):
```
node app.js
```

3. Running app:
```
DEBUG=myapp npm start
```

4. Running test:
First make sure you have dalekjs installed by :
```
npm install dalek-cli -g
npm install dalekjs --save-dev
```
then run:
```
dalek test/test.js
```

To start the website navigation, go to localhost:8080/home

TIP:
running on firefox would use lots of cpu,
chrome is fine
