const cors = require('cors')
const express = require('express')
const app = express()
const nodeFetch = require('node-fetch')
require('dotenv').config()

const PORT = process.env.PORT || 4000

const KEY = 'api_key=' + process.env.API_KEY

app.use(cors())
app.use(express.json())

// Get puuid and id
const BY_PLAYER_NAME_ENDPOINT_START = 'https://'
const BY_PLAYER_NAME_ENDPOINT_END = ".api.riotgames.com/lol/summoner/v4/summoners/by-name/"

// Get rank
const GET_SOLO_QUEUE_DATA_ENDPOINT_START = 'https://'
const GET_SOLO_QUEUE_DATA_ENDPOINT_END = ".api.riotgames.com/lol/league/v4/entries/by-summoner/"

// Get match Ids
const GET_MATCH_IDS_ONE = "https://"

const GET_MATCHES_IDS_TWO = ".api.riotgames.com/lol/match/v4/matchlists/by-account/"

app.get('/:server/:username', async (req, res) => {

    const username = req.params.username + '?'
    const server = req.params.server

    const player = {
        username: username,
        soloQ: {},
        matches: []
    }

    try {

        // Getting Puuid and Id
        const nameResponse = await nodeFetch(BY_PLAYER_NAME_ENDPOINT_START + server + BY_PLAYER_NAME_ENDPOINT_END + username + KEY)
        const nameData = await nameResponse.json()
        
        console.log(nameData)

        player.accountId = nameData.accountId
        player.id = nameData.id
        // player.puuid = nameData.puuid

        // // Getting Account Info
        const playerInfoResponse = await nodeFetch(GET_SOLO_QUEUE_DATA_ENDPOINT_START + server + GET_SOLO_QUEUE_DATA_ENDPOINT_END + player.id + '?' + KEY)
        const playerInfoData = await playerInfoResponse.json()

        // console.log(playerInfoData)

        try {
            player.soloQ.rank = playerInfoData[0].rank
            player.soloQ.tier = playerInfoData[0].tier
            player.soloQ.leaguePoints = playerInfoData[0].leaguePoints
        } catch {
            player.soloQ.rank = '-'
            player.soloQ.leaguePoints = '-'
        }

        // console.log(player)

        const matchesIDsResponse = await nodeFetch(GET_MATCH_IDS_ONE + server + GET_MATCHES_IDS_TWO + player.accountId + '?' + 'endIndex=15&beginIndex=1&' + KEY)
        const matchesIdsData = await matchesIDsResponse.json()
        console.log('MATCHES:', matchesIdsData)
        
        // // console.log(player)


    } catch (error) {
        console.error(error)
    }
})

app.listen(PORT, () => {
    console.log('Listening on port:', PORT)
})

// MID - 2 - 6
// ADC - 1 - 9
// TOP - 3 - 7
// JUNGLE - 4 - 8
// SUPP - 5 - 10

// If timeline.lane === 'BOTTOM'
    // check the role, if role is DUO_CARRY, lane is adc,
    // else lane is support