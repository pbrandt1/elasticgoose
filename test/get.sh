curl -XGET 'localhost:9200/elasticgoose/blip/_search?pretty=true' -d '
{
    "query" : {
        "match_all" : {}
    }
}'
