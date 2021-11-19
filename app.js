var app = angular.module('app', ['ngRoute', 'ngSanitize']);




// route
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/search/news/:query', {
        templateUrl: "./searchNews.html",
        controller: "searchNewsCtrl"
    })
    .when('/about', {
        templateUrl: "./AboutUs.html",
    })
    .when('/ContactUs', {
        templateUrl: "./AboutUs.html",
    })
    .when('/StockMarket', {
        templateUrl: "./news.html",
        controller: "StockmarketCtrl"
    })
    .when('/search', {
        templateUrl: 'search.html',
        controller: 'searchCtrl'
    })
    .when('/news/:id',{
        templateUrl: './newsContent.html',
        controller: 'newsContent'
    }).when('/', {
        templateUrl: './news.html',
        // controller: 'HomeController',
    })
        .otherwise({
            templateUrl: './404.html',
        });
}]);

// first headline
app.controller("newsHeadline", function ($scope, $rootScope, $interval, $location) {
    $rootScope.data = data;
    $scope.newsHeadline = data.slice(0,4);
    $rootScope.data = removeDataAmbigutive($rootScope.data);
    data = $rootScope.data;
})
// topnews controller
app.controller("topNews",function ($scope, $rootScope, $interval, $location) {
    $scope.topNews = data.slice(4,9);
    $scope.topNewsOther = $scope.topNews.slice(1, 5);
    console.log($scope.topNewsOther);
})
// stocknews controller
app.controller("stockNews",function($scope, $rootScope, $interval, $location){
// their are two coloumns so we need two arrays
    $scope.stockNewsCol1 = data.slice(0,4);
    $scope.stockNewsCol2 = data.slice(4,8);

    $scope.stockNewsCol1other = $scope.stockNewsCol1.slice(1,4);
    $scope.stockNewsCol2other = $scope.stockNewsCol2.slice(1,4);
})
// world news controller
app.controller("worldNews",function($scope, $rootScope, $interval, $location){
    $scope.worldNews = data.slice(0,5);
})
// news content controller
app.controller("newsContent",function($routeParams,$scope, $rootScope, $interval, $location){
    $scope.id = $routeParams.id;
    $scope.article = data.filter(function(item){
        return item.id == $scope.id;
    })[0];
    $scope.article = {...$scope.article, text:processData($scope.article.text.replace(/ /g, " "))}    

    $scope.relatedNews = data.filter(function(item){
        return item.tag.map(function(item1){
            return $scope.article.tag.includes(item1);
        })
    })
    // search in news article text
    $scope.searchTextFunction = function (text) {
        var len = text.length;
        var result = [];
        var temp = $scope.article.text;
        temp.forEach(function (item) {
            result.push(searchAndMakeBold(item, text));
        })
        $scope.text = result;

        $scope.article.synopsis = searchAndMakeBold($scope.synopsis, text);
    }
})
app.controller("searchNewsCtrl",function($scope, $rootScope, $interval, $location,$routeParams){
    $scope.query =$routeParams.query;

    $scope.result = data;
})
// app.controller("searchNewsCtrl",function($scope, $rootScope, $interval, $location){

// })
app.controller("searchCtrl",function($scope, $rootScope, $interval, $location){
    

})
// StockmarketCtrl
app.controller("StockmarketCtrl",function($scope, $rootScope, $interval, $location){
    // stock market data
})
// top bar controller
app.controller('headerController', function ($scope, $rootScope, $interval, $location) {
    // redirectTo
    $scope.redirectTo = function (path) {
        console.log(path);
        redirectToFunc(path)
    }
    // redirect
    $rootScope.redirectToFunc = function (path) {
        $location.path(path);
    }
})


app.controller('topHeaderController', function ($scope, $rootScope, $interval, $location) {
    // to update time top of page
    $scope.time = null;
    function tick() {
        let date = new Date();
        let hh = date.getHours();
        let mm = date.getMinutes();
        let ss = date.getSeconds();
        let session = "AM";
        if (hh == 0) {
            hh = 12;
        }
        if (hh > 12) {
            hh = hh - 12;
            session = "PM";
        }
        hh = (hh < 10) ? "0" + hh : hh;
        mm = (mm < 10) ? "0" + mm : mm;
        ss = (ss < 10) ? "0" + ss : ss;

        let time = hh + ":" + mm + ":" + ss + " " + session;
        $scope.time = time;
    }

    tick();
    $interval(tick, 1000);

    // to update date top of page
    $scope.date = null;
    function date() {
        let date = new Date();
        let dd = date.getDate();
        let mm = date.getMonth() + 1;
        let yy = date.getFullYear();
        dd = (dd < 10) ? "0" + dd : dd;
        mm = (mm < 10) ? "0" + mm : mm;
        let date1 = dd + "-" + mm + "-" + yy;
        $scope.date = date1;
    }
    date();

    // Sign In
    $scope.signIn = function () {
        $location.path('/signin');
    }
    // join
    $scope.join = function () {
        $location.path('/join');
    }
    // membership
    $scope.membership = function () {
        $location.path('/membership');
    }

})


function removeDataAmbigutive(data){
    var result = []
    result =data.map((item)=>{
        if(item.title.length<=0){
            item = {...item,title:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"}
        }
        if(item.synopsis.length<=0){
            item = {...item,synopsis:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
        }
        if(item.text.length<=5){
            item = {...item,text:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}
        }
        return item;
    })
    return result;
}


function redirectToFunc(path) {
    window.location = path;
}
// big para to small
function processData(data) {
    var result = [];
    var space_count = 1;
    var text = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i] == ".") {
            space_count--;
            if (space_count == 0) {
                result.push(text + ".");
                text = "";
                space_count = 1;
            }
        } else {
            text += data[i];
        }
    }
    return result;
}

// function for adding html tags to text
app.filter('trustAsHtml', ['$sce', function ($sce) {
    return $sce.trustAsHtml;
}]);



// search and make bold the text
function searchAndMakeBold(item, text) {
    var index = item.toUpperCase().indexOf(text.toUpperCase());
    if (index > -1) {
        var result = item.slice(0, index) + "<b>" + item.slice(index, index + text.length) + "</b>" + searchAndMakeBold(item.slice(index + text.length), text);
        return result;
    }
    return item;
}

// demo data
var data = [
    {
        title: "Need to boost domestic manufacturing of key ingredients for medicines: PM Modi",
        date: "18 Nov 2021",
        id: 1,
        article: "https://www.hindustantimes.com/india-news/need-to-boost-domestic-manufacturing-of-key-ingredients-for-medicines-pm-modi-101637234196594.html",
        image: "https://images.hindustantimes.com/img/2021/11/18/550x309/PM_Modi_Pharma_Summit_1637234620697_1637234630927.PNG",
        synopsis: "The Prime Minister said that the spirit of innovation in the Indian pharmaceutical industry led to India being at the forefront of Covid-19 vaccine production as well as a major exporter of PPE kits.",
        text: `Prime Minister Narendra Modi on Thursday inaugurated the Global Innovation Summit of the Pharmaceutical sector organised by the Indian Pharmaceuticals Association. During the event, the Prime Minister lauded the role played by the Indian pharmaceutical industry during the pandemic and highlighted that the nation needs to ramp up domestic manufacturing of key ingredients for vaccines and medicines.“We must think about ramping up domestic manufacturing of key ingredients for vaccines and medicines. This is one frontier that India has to conquer,” the Prime Minister said. “Our vision is to create an ecosystem for innovation that will make India a leader in drug discovery and innovative medical devices,” he said. The Prime Minister said that the spirit of innovation in the Indian pharmaceutical industry led to India being at the forefront of Covid-19 vaccine production as well as a major exporter of PPE kits.“We exported lifesaving medicines and medical equipment to over 150 countries during the initial phase of the pandemic. We have also exported more than 65 million doses of Covid vaccines to nearly 100 countries this year,” he added.PM Modi said due to Covid-19 every aspect of the healthcare sector was brought under global focus over the last two years. “The Indian pharmaceutical industry has been a key aspect for the Indian economy. The Indian healthcare sector attracted over $12 billion in FDI since 2014,” PM Modi said.The event was also attended by Union health minister Mansukh Mandaviya and industry leaders like Cadila Healthcare CEO Pankaj Patel and 40 other national and international speakers who will discuss a range of issues related to pharmaceutical sector like regulatory environment, funding for innovation, industry-academia collaboration, and the innovation infrastructure etc. Mandaviya, during the event, said PM Modi’s vision of a self-reliant India helped the pharmaceutical industry, especially during the Covid-19 period. “The Indian pharmaceutical industry thrived during the Covid-19 and provided critical drugs and medical essentials to more than 150 nations,” Mandaviya said.Cadila CEO Patel and Mandaviya both also highlighted that India’s vaccination drive was supported by the Aatmanirbhar Bharat which also led to developments of the India-made vaccine Covaxin, developed by Hyderabad-based pharma major Bharat Biotech. He also said that the Indian pharmaceutical sector will grow exponentially within the next decade.
        `,
        tag:["tag1","tag2","tag3"]
    },
    {
        title: "LAC drow: India, China agree to hold next round of military talks soon",
        date: "18 Nov 2021",
        id: 2,
        article: "https://timesofindia.indiatimes.com/india/lac-row-india-china-agree-to-hold-next-round-of-military-talks-soon/articleshow/87782132.cms",
        image: "https://static.toiimg.com/thumb/msid-87782129,imgsize-174648,width-400,resizemode-4/87782129.jpg",
        synopsis: "",
        text: `Lorem Ipsum is sadsimply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.        `,
        tag:["tag1","tag2","tag3"]
    },
    {
        title: "LAC row: India, China agree to hold next round of military talks soon",
        date: "18 Nov 2021",
        id: 3,
        article: "https://www.indiatoday.in/india/story/open-for-muslim-brothers-gurugram-gurdwara-association-offers-space-for-namaz-1878258-2021-11-18",
        image: "https://static.toiimg.com/thumb/msid-87782129,imgsize-174648,width-400,resizemode-4/87782129.jpg",
        synopsis: "The Gurdwara association of Sadar Bazar in Gurugram has offered its premises to the Muslim community for Friday prayers after some groups objected to offering of namaz in public places.",
        text: `Following odasbjections raised by some groups over the offering of namaz in public places in Gurugram, the Gurdwara association of Sadar Bazar in Gurugram has decided to offer its premises to the Muslim community for Friday prayers. "It's 'Guru Ghar', open for all communities with no discrimination. There shouldn't be any politics here. Basement is now open for Muslim brothers who want to offer 'Jumme ki namaz'," news agency ANI quoted Sherdil Singh Sidhu, president, Gurudwara Guru Singh Sabha, as saying. "If there's an open space, Muslims should be allowed to offer namaz. We shouldn't fight over such petty issues. People who were offering namaz in open sought administration's permission and those who had problems should have approached the administration before attacking them," he added. On November 3, the Gurugram administration withdrew permission for namaz at eight of the 37 designated sites in the city after locals and resident welfare associations raised objections over it. The permissions for offering namaz were withdrawn from eight designated sites which include Bengali Basti in Sector 49, V block DLF phase 3, Surat Nagar Phase-1, Kheri Majra village (outskirts) near Dwarka Expressway, Ramgarh village near Sector 68 , DLF square tower near Rampur village in the direction of Nakhrola road. Representatives of Muslim groups have submitted a memorandum to Gurugram administration to stop offering namaz on government lands over repeated objections by right-wing Hindu groups and residents for the sake of peace and harmony. They also asked the administration to clear the encroachments on 19 land parcels of the Waqf Board so that they could offer namaz there.`,
        tag:["tag1","tag2","tag3"]},
    {
        title: "LAC r2ow: India, China agree to hold next round of military talks soon",
        date: "18 Nov 2021",
        id: 4,
        article: "https://www.ndtv.com/india-news/bodies-of-2-businessmen-killed-in-j-k-encounter-to-be-returned-to-families-2616400",
        image: "https://c.ndtvimg.com/2021-11/scrbt00c_kashmir-businessman-650_625x300_16_November_21.jpg",
        synopsis: "",
        text: `Srinagar: The bodeweies of two businessmen killed in Jammu and Kashmir's Srinagar were exhumed this evening amid huge protests, hours after a magisterial inquiry was ordered into the encounter. Sources said they will be handed over to the families later.  
        The families have claimed that Mohammad Altaf Bhat and dental surgeon Mudasir Gul  were killed in cold blood by security forces and the police refused to hand over their bodies. Protests seared the state soon after, with political leaders slamming the Centre.
        
        Altaf Bhat and Mudasir Gul were among the four people who died in an anti-terror operation at a commercial complex in Srinagar's Hyderpora on Monday.
        
        The police first said the men were shot by terrorists, but later said they may have been killed in the crossfire. The others killed were a Pakistani terrorist and his associate, the police said.
        
        Later, the police said Altaf Bhat, who owned the complex, would be counted as a "harbourer of terrorists" as he did not inform the authorities about his tenants, one of whom was a terrorist.Earlier today, as political parties rallied behind the families, Lieutenant Governor Manoj Sinha ordered a magisterial probe into the killings. Within hours, Deputy Commissioner of Srinagar Muhammad Aijaz Asad appointed additional district magistrate Khurshid Ahmad Shah as inquiry officer.Bodies Of 2 Businessmen Killed In J&K Encounter Exhumed, To Be Returned

        7
        Srinagar: The bodies of two businessmen killed in Jammu and Kashmir's Srinagar were exhumed this evening amid huge protests, hours after a magisterial inquiry was ordered into the encounter. Sources said they will be handed over to the families later.  
        The families have claimed that Mohammad Altaf Bhat and dental surgeon Mudasir Gul  were killed in cold blood by security forces and the police refused to hand over their bodies. Protests seared the state soon after, with political leaders slamming the Centre.
        
        Altaf Bhat and Mudasir Gul were among the four people who died in an anti-terror operation at a commercial complex in Srinagar's Hyderpora on Monday.
        
        The police first said the men were shot by terrorists, but later said they may have been killed in the crossfire. The others killed were a Pakistani terrorist and his associate, the police said.
        
        Later, the police said Altaf Bhat, who owned the complex, would be counted as a "harbourer of terrorists" as he did not inform the authorities about his tenants, one of whom was a terrorist.
        
        ALSO READ
        Thankful To Lt Governor For Ordering Inquiry: Brother Of Civilian Killed In Srinagar Encounter
        Thankful To Lt Governor For Ordering Inquiry: Brother Of Civilian Killed In Srinagar Encounter
        Gupkar Alliance Demands Judicial Inquiry Into Srinagar Encounter
        Gupkar Alliance Demands Judicial Inquiry Into Srinagar Encounter
        Farooq Abdullah To Ask President For "Credible Probe" In Srinagar Encounter
        Farooq Abdullah To Ask President For "Credible Probe" In Srinagar Encounter
        Earlier today, as political parties rallied behind the families, Lieutenant Governor Manoj Sinha ordered a magisterial probe into the killings. Within hours, Deputy Commissioner of Srinagar Muhammad Aijaz Asad appointed additional district magistrate Khurshid Ahmad Shah as inquiry officer.
        
        
        "We will look into the demands of the families. We are open to correction if anything has gone wrong. A police probe will also find out what went wrong," Jammu and Kashmir Director General of Police Dilbagh Singh told NDTV."We will find out what happened in the Hyderpora encounter. We are for the safety of people and will not shy away from a probe," he added.`
        ,
        tag:["tag1","tag2","tag3"]
    },
    {
        title: "Havoc in Tirupati as heavy rains flood many areas, submerge vehicles",
        date: "18 Nov 2021",
        id: 5,
        article: "https://www.thenewsminute.com/article/havoc-tirupati-heavy-rains-flood-many-areas-submerge-vehicles-157792",
        image: "https://www.thenewsminute.com/sites/default/files/styles/news_detail/public/Tirupati_Rains_181121_1200.jpg?itok=fa4MJDOT",
        synopsis: "Videos showed water gushing from the hill into the Kapileswara Swamy Temple at the foot of Tirumala Hills, inundating the premises.",
        text: `Several areas in Tirupati were inundated after heavy rains lashed Andhra Pradesh’s Chittoor district, causing massive flooding in many areas on Thursday, November 18. Water levels in and around several areas of Tirupati, Tirumala and the rest of the district, including Madhura Nagar, Gollavani Gunta, Lakshmipuram, Air Bypass road, Chandragiri town and the Kapila Theertham temple at the foot of the Tirumala hills have increased to a level where it has threatened to enter houses leaving residents worried. Traffic too has been disrupted due to floods. 

        Visuals showed auto rickshaws and parked two wheelers being swept away by the water that had flooded the streets. Another video showed a bus almost fully submerged, stuck in an underpass in the city. The Tirumala Ghat road has also seen massive flooding, and there have reportedly been landslides and several trees have been uprooted. Another visual showed water gushing from the hill into the Kapileswara Swamy Temple at the foot of Tirumala Hills. Another video showed a man being washed away on the Tirumala Ghat road.
        
        The heavy rains are a result of the low pressure area in the Bay of Bengal intensifying into a depression. Heavy rains had been predicted in the city owing to this, and the Tirumala Tirupati Devasthanam (TTD) had earlier shut two pedestrian routes to the Venkateswara temple in Tirumala for two days (November 17 and 18) in view of the heavy rain alert.
        
        Havoc in Tirupati as heavy rains flood many areas, submerge vehicles
Videos showed water gushing from the hill into the Kapileswara Swamy Temple at the foot of Tirumala Hills, inundating the premises.

Flooding near Kapileswara Swamy TempleSCREENGRAB
NEWS WEATHER THURSDAY, NOVEMBER 18, 2021 - 20:48



TNM Staff Follow @thenewsminute
Several areas in Tirupati were inundated after heavy rains lashed Andhra Pradesh’s Chittoor district, causing massive flooding in many areas on Thursday, November 18. Water levels in and around several areas of Tirupati, Tirumala and the rest of the district, including Madhura Nagar, Gollavani Gunta, Lakshmipuram, Air Bypass road, Chandragiri town and the Kapila Theertham temple at the foot of the Tirumala hills have increased to a level where it has threatened to enter houses leaving residents worried. Traffic too has been disrupted due to floods. 

Visuals showed auto rickshaws and parked two wheelers being swept away by the water that had flooded the streets. Another video showed a bus almost fully submerged, stuck in an underpass in the city. The Tirumala Ghat road has also seen massive flooding, and there have reportedly been landslides and several trees have been uprooted. Another visual showed water gushing from the hill into the Kapileswara Swamy Temple at the foot of Tirumala Hills. Another video showed a man being washed away on the Tirumala Ghat road.

The heavy rains are a result of the low pressure area in the Bay of Bengal intensifying into a depression. Heavy rains had been predicted in the city owing to this, and the Tirumala Tirupati Devasthanam (TTD) had earlier shut two pedestrian routes to the Venkateswara temple in Tirumala for two days (November 17 and 18) in view of the heavy rain alert.



Andhra Pradesh Chief Minister YS Jagan Mohan Reddy held a review meeting with the Deputy Commissioners of Nellore, Chittoor and Kadapa in the wake of heavy rains. He instructed them to inspect water levels in reservoirs and lakes regularly and take measures accordingly. He also spoke to the Chittoor Deputy Commissioner and gave instructions to arrange relief shelters with proper facilities, and to give Rs 1,000 as relief amount to those staying in relief shelters.Speaking to media personnel, Chittoor Deputy Commissioner M Hari Narayanan said, “As per Andhra Pradesh State Disaster Management (APSDMA) alert, on Thursday and Saturday, heavy rains are expected in the district. Mandal teams and municipal teams have been alerted. Mainly, this year, excess rainfall was recorded in the district. All rivers and lakes are filled. The Chief Minister has given directions to take precautions in those areas. Accordingly, in all mandals, near rivers and ponds, officials have been alerted to avoid human loss.”

“I request people to avoid any causeways or bridges where water levels are high. Such attempts have led to deaths in recent times. In such places, revenue and police officials have identified such places and placed pickets to avoid people from crossing them,” he added.

Four relief camps have been arranged and around 300 people have been shifted to the camps. Fire and police department personnel and NDRF, SDRF teams have also been placed on standby to evacuate people from inundated localities if needed, according to the Deputy Commissioner. He has also declared a two-day holiday for schools and colleges in the district for Thursday and Friday.

Tirupati Urban SP Ch Venkatappala Naidu stated that in case of emergency, people can dial 100, or reach out to the police on WhatsApp at 8099999977, or contact the Police Control Room at 6309913960.`
,
        tag:["tag1","tag2","tag3"]},
    {
        title: "Paytm Shares Crash 28% On Debut After India's Biggest-Ever IPO: 10 Points",
        date: "18 Nov 2021",
        id: 6,
        article: "https://www.ndtv.com/business/paytm-ipo-listing-news-paytm-makes-weak-stock-market-debut-stock-falls-over-9-from-ipo-price-2615354",
        image: "https://c.ndtvimg.com/2021-11/r8rkr3q_paytm-listing_625x300_18_November_21.jpg",
        synopsis: "Paytm shares made a weak stock market debut as the stock opened for trading at ₹ 1,950 on the National Stock Exchange.",
        text: `
        Paytm's IPO consisted of fresh issue of ₹ 8,300 crore and an OFS worth ₹ 10,000 crore.
        
        
        56
        Paytm's shares plunged as much as 28 per cent in a weak stock market debut on Thursday, a week after the country's biggest-ever initial public offering. The stock opened for trading at ₹ 1,950 on the NSE, marking a decline of 9.3 per cent or ₹ 200 from its issue price of ₹ 2,150. Paytm shares extended losses after opening as the stock fell as much as 28 per cent, from issue price, to hit an intraday low of ₹ 1,560.`
        ,
        tag:["tag1","tag2","tag3"]
    },
    {
        title: "Google CEO Sundar Pichai was asked if he owns cryptocurrency. Here's what he said",
        date: "18 Nov 2021",
        id: 7,
        article: "https://www.livemint.com/market/cryptocurrency/google-ceo-sundar-pichai-was-asked-if-he-owns-cryptocurrency-here-s-what-he-said-11637233899473.html",
        image: "https://images.livemint.com/img/2021/11/18/600x338/SINGAPORE-NEF-75_1637241184451_1637241195346.jpg",
        synopsis: "On cryptocurrency, Google chief executive Sundar Pichai said that he doesn't own any, adding that wish he did",
        text: `In an interview with Bloomberg Television’s Emily Chang for the Bloomberg New Economy Forum in Singapore, Google chief executive Sundar Pichai spoke about cryptocurrency, saying that he doesn't own any, adding that wish he did.

        “I’ve dabbled in it, you know, in and out," Pichai said.Earlier today, Prime Minister Narendra Modi urged cooperation between the world's democracies to ensure cryptocurrencies like Bitcoin do not "end up in the wrong hands", delivering the comments while his government drew up new rules for digital currencies.

        PM Modi did not elaborate on those fears in his speech delivered virtually to the Sydney Dialogue, a forum focused on emerging, critical and cyber technologies.
        
        But authorities in India and elsewhere have flagged the dangers of cryptocurrencies being used by terrorist groups and organised crime, and the destabilising risk they posed to national economies.
        
        After extolling the opportunities presented by cyber age technology, Modi sound a note of caution regarding digital currencies.
        
        "Take cryptocurrency or Bitcoin, for example. It is important that all democratic nations work together on this and ensure it does not end up in the wrong hands, which can spoil our youth," Modi said.
        
        Indian officials currently drafting regulations are likely to propose a ban on all transactions and payments in cryptocurrencies, while letting investors hold them as assets,like gold, bonds and stocks, the Economic Times newspaper reported on Wednesday.Modi chaired a meeting to discuss India's approach to cryptocurrencies on Saturday, and the Economic Times said his cabinet could receive the draft regulations for review within two to three weeks.

        In September, regulators in China banned all cryptocurrency transactions and mining of cryptocurrency.
        
        Bitcoin, the world's biggest cryptocurrency, is hovering around the $60,000-level, having more than doubled its value since the start of this year.
        
        India's digital currency market was worth $6.6 billion in May 2021, compared with $923 million in April 2020, according to blockchain data platform Chainalysis.
        
        With agency inputs
        
        `,
        tag:["tag1","tag2","tag3"]
    },
    {
        title: "Watch- Rohit Sharma Slaps Mohammed Siraj In The Dugout, Video Goes Viral",
        date: "18 Nov 2021",
        id: 8,
        article: "https://cricketaddictor.com/new-zealand-tour-of-india-2021/watch-rohit-sharma-slaps-mohammed-siraj-in-the-dugout-video-goes-viral/",
        image: "https://cricketaddictor.com/wp-content/uploads/2021/10/Mohammed-Siraj-1.jpg",
        synopsis: "",
        text: `A funny video of Rohit Sharma and Mohammed Siraj has gone viral since Wednesday night, when the opener led India for the first time as a full-time T20I skipper, against New Zealand in Jaipur.

        The video shows Rohit Sharma hitting Siraj on the back of his head when the pair were sitting in the dugout along with KL Rahul.
        
        The trio was staring at something on their left before Rahul turned his head to Rohit Sharma, who quickly hit the paceman sitting in front of him. Siraj was seen smiling at that, indicating at perhaps a funny joke between them.It was great learning for them to understand what needs to be done: Rohit Sharma
        India chased down the target of 165 with 5 wickets and two balls to spare, taking a 1-0 lead in the series.
        
        While India were cruising at one stage with Suryakumar Yadav’s fifty, after his dismissal Shreyas Iyer and Rishabh Pant couldn’t time their shots properly as the game went deep. With 9 needed off 6 balls, Venkatesh Iyer swatted a four but got out before Pant finished things off with a boundary.
        
        India vs New Zealand
        Suryakumar Yadav (Credits: Twitter)
        Rohit Sharma highlighted that it was an important learning curve for the batters in a run-chase, while also applauding the bowlers who pulled things back after fifties from Martin Guptill and Mark Chapman.
        
        “Towards the end we saw it wasn’t easy, was a great learning for the guys because those guys haven’t batted in that situation before for India. It was great learning for them to understand what needs to be done, it’s not about power hitting all the time and you try and put the ball to the left or right of the fielder and try and take singles or find boundaries,” Rohit Sharma said at the post-match presentation.
        
        “As a team we are happy that those guys got to bat in that situation and finished the game off. Technically was a good game, missing a few players and to come and see what the new players have in terms of ability and I think the way we pulled it back in the last 3-4 overs was magnificent. In the end it was a great effort from all our bowlers,” he added.
        
        The second T20I is scheduled for Friday at the JSCA International Stadium Complex in Ranchi.`,
        tag:["tag1","tag2","tag3"]
    },
    {
        title: "Watch- Rohit Sharma Slaps Mohammed Siraj In The Dugout, Video Goes Viral",
        date: "18 Nov 2021",
        id: 9,
        article: "https://cricketaddictor.com/new-zealand-tour-of-india-2021/watch-rohit-sharma-slaps-mohammed-siraj-in-the-dugout-video-goes-viral/",
        image: "https://cricketaddictor.com/wp-content/uploads/2021/10/Mohammed-Siraj-1.jpg",
        synopsis: "",
        text: `A funny video of Rohit Sharma and Mohammed Siraj has gone viral since Wednesday night, when the opener led India for the first time as a full-time T20I skipper, against New Zealand in Jaipur.

        The video shows Rohit Sharma hitting Siraj on the back of his head when the pair were sitting in the dugout along with KL Rahul.
        
        The trio was staring at something on their left before Rahul turned his head to Rohit Sharma, who quickly hit the paceman sitting in front of him. Siraj was seen smiling at that, indicating at perhaps a funny joke between them.It was great learning for them to understand what needs to be done: Rohit Sharma
        India chased down the target of 165 with 5 wickets and two balls to spare, taking a 1-0 lead in the series.
        
        While India were cruising at one stage with Suryakumar Yadav’s fifty, after his dismissal Shreyas Iyer and Rishabh Pant couldn’t time their shots properly as the game went deep. With 9 needed off 6 balls, Venkatesh Iyer swatted a four but got out before Pant finished things off with a boundary.
        
        India vs New Zealand
        Suryakumar Yadav (Credits: Twitter)
        Rohit Sharma highlighted that it was an important learning curve for the batters in a run-chase, while also applauding the bowlers who pulled things back after fifties from Martin Guptill and Mark Chapman.
        
        “Towards the end we saw it wasn’t easy, was a great learning for the guys because those guys haven’t batted in that situation before for India. It was great learning for them to understand what needs to be done, it’s not about power hitting all the time and you try and put the ball to the left or right of the fielder and try and take singles or find boundaries,” Rohit Sharma said at the post-match presentation.
        
        “As a team we are happy that those guys got to bat in that situation and finished the game off. Technically was a good game, missing a few players and to come and see what the new players have in terms of ability and I think the way we pulled it back in the last 3-4 overs was magnificent. In the end it was a great effort from all our bowlers,” he added.
        
        The second T20I is scheduled for Friday at the JSCA International Stadium Complex in Ranchi.`,
        tag:["tag1","tag2","tag3"]
    },
]




// {
    //     title: "",
    //     date: "18 Nov 2021",
    //     id: 1,
    //     article: "",
    //     image: "",
    //     synopsis: "",
    //     text: ``
    // },