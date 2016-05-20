#!/bin/bash
npm run patch && \
ssh mrdev@citylights.fina.io 'cd ~; ./release-citylights.sh'
