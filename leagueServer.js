const cors = require('cors')
const express = require('express')
const app = express()
const nodeFetch = require('node-fetch')
require('dotenv').config()

const PORT = process.env.PORT || 4000

const KEY = 'api_key=' + process.env.API_KEY

const BY_PLAYER_NAME_ENDPOINT_START = 'https://'

const BY_PLAYER_NAME_ENDPOINT_END = ".api.riotgames.com/lol/summoner/v4/summoners/by-name/"

const GET_MATCHES_BY_PUUID_ENDPOINT_ONE = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/"

const GET_MATCH_DATA_WITH_ID_ENDPOINT = "https://americas.api.riotgames.com/lol/match/v5/matches/"

const GET_SOLO_QUEUE_DATA_ENDPOINT_START = 'https://'

const GET_SOLO_QUEUE_DATA_ENDPOINT_END = ".api.riotgames.com/lol/league/v4/entries/by-summoner/"

app.use(cors())
app.use(express.json())

app.get('/:server/:username', async (req, res) => {

    const playerName = req.params.username + '?'

    const player = {
        matches: '',
        puuid: '',
        id: '',
        soloQ: {},
        playerIcon: '',
        matches: []
    }
    
    try {
        const nameResponse = await nodeFetch(BY_PLAYER_NAME_ENDPOINT_START + req.params.server + BY_PLAYER_NAME_ENDPOINT_END + playerName + KEY)

        if (nameResponse === 404) {
            res.status(404).json({
                error: 'Player not found'
            })
        }

        const nameData = await nameResponse.json()

        player.id = nameData.id
        player.puuid = nameData.puuid

        // GETTING ACCOUNT INFO
        const playerInfoResponse = await nodeFetch(GET_SOLO_QUEUE_DATA_ENDPOINT_START + req.params.server + GET_SOLO_QUEUE_DATA_ENDPOINT_END + nameData.id + '?' + KEY)
        const playerInfo = await playerInfoResponse.json()
  
        try {
            player.soloQ({
                rank: playerInfo[0].rank,
                tier: playerInfo[0].tier,
                leaguePoints: playerInfo[0].leaguePoints
            })
        } catch (err) {
            player.soloQ({
                rank: '-',
                leaguePoints: '-'
            })
        }

        while (playerMatchesData.length < 10) {

            const matchesIDsResponse = await nodeFetch(GET_MATCHES_BY_PUUID_ENDPOINT_ONE + nameData.puuid + `/ids?start=${startCount.toString()}&count=${endCount.toString()}&` + KEY)

            // Gets array of matchesIDs(strings)
            const matchesIDs = await matchesIDsResponse.json()
            
            for (const matchID of matchesIDs) {
                const matchResponse = await nodeFetch(GET_MATCH_DATA_WITH_ID_ENDPOINT + matchID + "?" + KEY)
                if (matchResponse.status === 200) {
                    const matchData = await matchResponse.json()
                    player.matches.push(matchData)
                }
            }
            startCount += 10
            endCount += 10
        }
        res.status(200).json(player)
    } catch (error) {
        res.json({
            error: 'Could not find matches'
        })
    }
})

app.listen(PORT, () => {
    console.log('Listening on port:', PORT)
})