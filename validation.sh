lastCommitMsg=$(git log -1 --pretty=%B --no-merges)
        if [[ $lastCommitMsg != *"ver:"* || $lastCommitMsg != *"tkt:"* || $lastCommitMsg != *"msg:"* ]]; then
            echo "Commit message format is invalid. It should contain ver:, tkt:, and msg:"
            exit 1
        fi

        verPattern="[0-9]+[.][0-9]+[.][0-9]+"
        if [[ ! $lastCommitMsg =~ $verPattern ]]; then
            echo "Version format is invalid. It should be in the format ver:x.y.z"
            exit 1
        fi
        tktpattern="tkt:([^ ]+)"
        msgpattern="msg:(.*)"
        version=$(echo $lastCommitMsg | grep -oE "$verPattern" | cut -d ":" -f 2)
        ticketJira=$(echo $lastCommitMsg | grep -oE "$tktpattern" | cut -d ":" -f 2)
        message=$(echo $lastCommitMsg | grep -oE "$msgpattern" | cut -d ":" -f 2)

        echo "Version: $version"
        echo "Ticket Jira: $ticketJira"
        echo "Message: $message"
        
